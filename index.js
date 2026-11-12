/**
 * dsh-school — Host half.
 *
 * Keeps the Moodle session on this machine and answers the browser half over a
 * same-origin route. The password is used once to exchange for a Web Services
 * token, then dropped; only the token is stored, as a credential record.
 */

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, extname, isAbsolute, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_SITE_URL = 'https://l.xmu.edu.my'
// Records are addressed as <owner>/<id>; a colon here makes the credential
// store refuse the document at boot, which takes the whole app down.
const CREDENTIAL_KEY = 'dsh-school/moodle'
const API_PREFIX = '/school/api'
const MAX_BODY_BYTES = 512 * 1024
const DAY_SECONDS = 86400

export const inject = ['webServer', 'credentials']

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function stripTags(value) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizeSegment(value, fallback) {
  let text = String(value || '')
    .replace(/[\u0000-\u001f<>:"/\\|?*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  text = text.replace(/^\.+/, '').replace(/\.+$/, '')
  if (text === '') text = fallback
  if (text.length > 80) text = text.slice(0, 80).trim()
  return text
}

function cleanManualEvents(input) {
  if (!Array.isArray(input)) return []
  const out = []
  for (const item of input.slice(0, 200)) {
    if (!item || typeof item !== 'object') continue
    const name = String(item.name || '').trim()
    const timesort = Number(item.timesort)
    if (name === '' || !Number.isFinite(timesort) || timesort <= 0) continue
    out.push({
      id: typeof item.id === 'string' && item.id !== '' ? item.id : 'manual-' + timesort + '-' + out.length,
      name,
      timesort,
      course: String(item.course || '').trim(),
    })
  }
  return out
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    request.on('data', (chunk) => {
      if (settled) return
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      size += buffer.length
      if (size > MAX_BODY_BYTES) {
        settled = true
        reject(new HttpError(413, '请求体过大'))
        request.destroy()
        return
      }
      chunks.push(buffer)
    })
    request.on('end', () => {
      if (settled) return
      settled = true
      // Decode once, from the complete byte sequence: a multi-byte character
      // split across chunks would otherwise be corrupted by per-chunk toString.
      const raw = Buffer.concat(chunks).toString('utf8')
      if (raw.trim() === '') return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new HttpError(400, '请求体不是合法 JSON'))
      }
    })
    request.on('error', (error) => {
      if (settled) return
      settled = true
      reject(error)
    })
  })
}

function send(response, status, value) {
  const body = JSON.stringify(value)
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
  })
  response.end(body)
}

export function apply(ctx, config) {
  const siteUrl = String((config && config.siteUrl) || DEFAULT_SITE_URL).replace(/\/+$/, '')
  const credentials = ctx.credentials

  async function readSession() {
    try {
      const record = await credentials.readRecord(CREDENTIAL_KEY)
      if (!record || record.kind !== 'grant') return undefined
      const payload = record.payload
      if (!payload || typeof payload !== 'object') return undefined
      if (typeof payload.token !== 'string' || payload.token === '') return undefined
      return payload
    } catch {
      // A credential-store problem must never fail plugin activation.
      return undefined
    }
  }

  async function requireSession() {
    const session = await readSession()
    if (!session) throw new HttpError(401, '尚未登录')
    return session
  }

  async function exchangeToken(username, password) {
    const form = new URLSearchParams({ username, password, service: 'moodle_mobile_app' })
    const response = await fetch(siteUrl + '/login/token.php', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      throw new HttpError(502, 'Moodle 登录接口返回了非 JSON 响应')
    }
    if (!data || typeof data.token !== 'string' || data.token === '') {
      const reason = data && typeof data.error === 'string' ? data.error : '登录失败'
      throw new HttpError(401, reason)
    }
    return data.token
  }

  async function callFunction(fn, params, token) {
    const form = new URLSearchParams({
      wstoken: token,
      wsfunction: fn,
      moodlewsrestformat: 'json',
    })
    for (const [key, value] of Object.entries(params || {})) {
      if (value === undefined || value === null) continue
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item === undefined || item === null) return
          form.set(key + '[' + index + ']', String(item))
        })
        continue
      }
      form.set(key, String(value))
    }
    const response = await fetch(siteUrl + '/webservice/rest/server.php', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      throw new HttpError(502, 'Moodle 返回了非 JSON 响应')
    }
    if (data && data.exception) {
      const code = String(data.errorcode || '')
      if (code === 'invalidtoken' || code === 'accessexception') {
        throw new HttpError(401, '登录状态已失效，请重新登录')
      }
      throw new HttpError(502, typeof data.message === 'string' ? data.message : code || 'Moodle 调用失败')
    }
    return data
  }

  function defaultRoot() {
    const configured = config && typeof config.downloadDir === 'string' ? config.downloadDir.trim() : ''
    if (configured !== '') return configured
    return join(homedir(), 'Downloads', 'Moodle')
  }

  // The chosen folder outlives restarts in a small file beside the plugin, so
  // changing it takes effect immediately without reloading the entry.
  const settingsFile = fileURLToPath(new URL('./school-settings.json', import.meta.url))
  let customRoot = ''
  let manualEvents = []
  let ignoredEvents = []
  try {
    const stored = JSON.parse(readFileSync(settingsFile, 'utf8'))
    if (stored && typeof stored.downloadDir === 'string') customRoot = stored.downloadDir.trim()
    if (stored && Array.isArray(stored.manualEvents)) manualEvents = cleanManualEvents(stored.manualEvents)
    if (stored && Array.isArray(stored.ignoredEvents)) {
      ignoredEvents = stored.ignoredEvents.filter((id) => typeof id === 'string' && id !== '').slice(0, 500)
    }
  } catch {
    customRoot = ''
  }

  async function persistSettings() {
    await writeFile(settingsFile, JSON.stringify({ downloadDir: customRoot, manualEvents, ignoredEvents }, null, 2), 'utf8')
  }

  function downloadRoot() {
    return customRoot !== '' ? customRoot : defaultRoot()
  }

  async function saveRoot(directory) {
    customRoot = directory
    await persistSettings()
  }

  async function downloadOne(token, item, root) {
    const raw = String(item.url || '')
    let source
    try {
      source = new URL(raw, siteUrl + '/')
    } catch {
      throw new HttpError(400, '不是可下载的 Moodle 文件地址')
    }
    // Web-service file links come back as /webservice/pluginfile.php; browser
    // links use /pluginfile.php. Both live on the same site origin.
    if (source.origin !== new URL(siteUrl).origin) {
      throw new HttpError(400, '文件地址不属于 Moodle 站点')
    }
    if (!/\/pluginfile\.php(\/|$)/.test(source.pathname)) {
      throw new HttpError(400, '不是可下载的 Moodle 文件地址')
    }
    source.searchParams.set('token', token)
    const response = await fetch(source, { signal: AbortSignal.timeout(120000) })
    if (!response.ok) throw new HttpError(502, '下载失败：HTTP ' + response.status)
    const bytes = Buffer.from(await response.arrayBuffer())

    const termDir = sanitizeSegment(item.term, '未识别学期')
    const courseDir = sanitizeSegment(item.course, '未命名课程')
    const categoryDir = sanitizeSegment(item.category, '其他')
    const fileName = sanitizeSegment(item.name, 'file')

    const directory = join(root, termDir, courseDir, categoryDir)
    await mkdir(directory, { recursive: true })

    // Two weeks can hold files with the same name; never overwrite silently.
    const extension = extname(fileName)
    const stem = extension === '' ? fileName : fileName.slice(0, fileName.length - extension.length)
    let finalName = fileName
    let counter = 2
    while (await stat(join(directory, finalName)).catch(() => null)) {
      finalName = stem + ' (' + counter + ')' + extension
      counter += 1
      if (counter > 200) break
    }

    const fullPath = join(directory, finalName)
    await writeFile(fullPath, bytes)
    return {
      path: [termDir, courseDir, categoryDir, finalName].join('/'),
      fullPath,
      bytes: bytes.length,
    }
  }

  // Only ever hand Explorer a document type; anything else reveals its folder
  // instead of launching it.
  const OPENABLE = new Set([
    '.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.md',
    '.csv', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.zip', '.rar', '.7z',
    '.mp4', '.mov', '.mp3', '.wav',
  ])

  function launch(target, asFile) {
    return new Promise((resolve) => {
      const platform = process.platform
      const command = platform === 'win32' ? 'explorer.exe' : (platform === 'darwin' ? 'open' : 'xdg-open')
      // Explorer takes the document or the folder directly; the others need an
      // explicit flag to reveal a file inside its folder.
      const args = platform === 'win32' ? [target] : (asFile ? [target] : [dirname(target)])
      let child
      try {
        child = spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: false })
      } catch (error) {
        resolve({ ok: false, error: error instanceof Error ? error.message : String(error) })
        return
      }
      let settled = false
      child.on('spawn', () => {
        if (settled) return
        settled = true
        resolve({ ok: true })
      })
      child.on('error', (error) => {
        if (settled) return
        settled = true
        resolve({ ok: false, error: error instanceof Error ? error.message : String(error) })
      })
      child.unref()
    })
  }

  async function handleLogin(request, response) {
    const body = await readJson(request)
    const username = String(body.username || '').trim()
    const password = String(body.password || '')
    if (username === '' || password === '') throw new HttpError(400, '请填写 Campus ID 和密码')

    const token = await exchangeToken(username, password)
    const info = await callFunction('core_webservice_get_site_info', {}, token)
    const profile = {
      userid: info && info.userid,
      fullname: (info && info.fullname) || username,
      sitename: (info && info.sitename) || '',
      username: (info && info.username) || username,
    }
    await credentials.modifyRecord(CREDENTIAL_KEY, async () => ({
      kind: 'grant',
      payload: { token, profile, siteUrl },
    }))
    send(response, 200, { loggedIn: true, siteUrl, profile })
  }

  async function handleLogout(response) {
    await credentials.deleteRecord(CREDENTIAL_KEY)
    send(response, 200, { loggedIn: false })
  }

  async function handleStatus(response) {
    const session = await readSession()
    if (!session) {
      send(response, 200, { loggedIn: false, siteUrl, downloadDir: downloadRoot() })
      return
    }
    send(response, 200, { loggedIn: true, siteUrl, downloadDir: downloadRoot(), profile: session.profile })
  }

  async function handleCourses(response) {
    const session = await requireSession()
    const list = await callFunction(
      'core_enrol_get_users_courses',
      { userid: session.profile && session.profile.userid },
      session.token,
    )
    const courses = (Array.isArray(list) ? list : []).map((course) => ({
      id: course.id,
      fullname: course.fullname,
      shortname: course.shortname,
      visible: course.visible,
      enddate: course.enddate,
    }))
    send(response, 200, { courses })
  }

  async function handleContents(request, response) {
    const session = await requireSession()
    const body = await readJson(request)
    const courseid = Number(body.courseid)
    if (!Number.isFinite(courseid) || courseid <= 0) throw new HttpError(400, '缺少 courseid')

    const raw = await callFunction('core_course_get_contents', { courseid }, session.token)
    const sections = (Array.isArray(raw) ? raw : []).map((section) => ({
      id: section.id,
      name: section.name || '',
      modules: (Array.isArray(section.modules) ? section.modules : []).map((module) => ({
        id: module.id,
        name: module.name || module.modname || '',
        modname: module.modname || '',
        files: (Array.isArray(module.contents) ? module.contents : [])
          .filter((item) => item && item.type === 'file' && typeof item.fileurl === 'string')
          .map((item) => ({
            name: item.filename || '',
            size: item.filesize,
            mimetype: item.mimetype || '',
            url: item.fileurl,
          })),
      })),
    }))
    send(response, 200, { sections })
  }

  async function handleDownload(request, response) {
    const session = await requireSession()
    const body = await readJson(request)
    const files = Array.isArray(body.files) ? body.files : []
    if (files.length === 0) throw new HttpError(400, '没有选中任何文件')
    if (files.length > 300) throw new HttpError(400, '一次最多下载 300 个文件')

    const root = downloadRoot()
    const results = []
    for (const item of files) {
      try {
        const saved = await downloadOne(session.token, item || {}, root)
        results.push({
          ok: true,
          name: String((item && item.name) || ''),
          path: saved.path,
          fullPath: saved.fullPath,
          bytes: saved.bytes,
        })
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : '下载失败'
        results.push({ ok: false, name: String((item && item.name) || ''), error: message })
      }
    }
    send(response, 200, { root, results })
  }

  async function handleGetSettings(response) {
    send(response, 200, {
      downloadDir: downloadRoot(),
      isCustom: customRoot !== '',
      defaultDir: defaultRoot(),
    })
  }

  async function handleSetSettings(request, response) {
    const body = await readJson(request)
    const requested = String(body.downloadDir || '').trim()
    if (requested === '') {
      await saveRoot('')
      send(response, 200, { downloadDir: downloadRoot(), isCustom: false })
      return
    }
    if (!isAbsolute(requested)) {
      throw new HttpError(400, '请填写完整路径，例如 C:\\Users\\你\\Documents\\课件')
    }
    await mkdir(requested, { recursive: true })
    const info = await stat(requested).catch(() => null)
    if (!info || !info.isDirectory()) throw new HttpError(400, '这个路径不是文件夹')
    await saveRoot(requested)
    send(response, 200, { downloadDir: downloadRoot(), isCustom: true })
  }

  async function handlePickDirectory(response) {
    const picker = ctx.get('directoryPicker')
    const capability = picker && typeof picker.capability === 'function' ? picker.capability() : null
    if (!capability || capability.kind !== 'native' || typeof capability.pick !== 'function') {
      throw new HttpError(501, '这个环境没有系统目录选择器，请直接填写路径')
    }
    const controller = new AbortController()
    const picked = await capability.pick(controller.signal)
    send(response, 200, { path: typeof picked === 'string' ? picked : null })
  }

  async function handleIgnoredEvents(request, response) {
    if (request.method === 'GET') {
      send(response, 200, { ids: ignoredEvents })
      return
    }
    const body = await readJson(request)
    const ids = Array.isArray(body.ids) ? body.ids : []
    ignoredEvents = Array.from(new Set(ids.filter((id) => typeof id === 'string' && id !== ''))).slice(0, 500)
    await persistSettings()
    send(response, 200, { ids: ignoredEvents })
  }

  async function handleManualEvents(request, response) {
    if (request.method === 'GET') {
      send(response, 200, { events: manualEvents })
      return
    }
    const body = await readJson(request)
    manualEvents = cleanManualEvents(body.events)
    await persistSettings()
    send(response, 200, { events: manualEvents })
  }

  async function handleReveal(request, response) {
    const body = await readJson(request)
    const rootResolved = resolve(downloadRoot())
    const requested = String(body.path || '').trim()
    const target = resolve(
      requested === ''
        ? rootResolved
        : (isAbsolute(requested) ? requested : join(rootResolved, requested)),
    )
    if (target !== rootResolved && !target.startsWith(rootResolved + sep)) {
      throw new HttpError(400, '只能打开下载目录里的内容')
    }
    await mkdir(rootResolved, { recursive: true })
    const info = await stat(target).catch(() => null)
    if (!info) throw new HttpError(404, '文件不存在，可能已被移动或删除')

    const asFile = body.mode === 'open' && info.isFile() && OPENABLE.has(extname(target).toLowerCase())
    // Revealing a file means opening its folder, not launching the document.
    const landing = asFile ? target : (info.isFile() ? dirname(target) : target)
    const result = await launch(landing, asFile)
    if (!result.ok) throw new HttpError(502, '系统没有接受打开请求：' + (result.error || '未知原因'))
    send(response, 200, { ok: true, target: landing, openedAs: asFile ? 'file' : 'folder' })
  }

  async function loadActionEvents(session, from, to) {
    const data = await callFunction(
      'core_calendar_get_action_events_by_timesort',
      { timesortfrom: from, timesortto: to, limitnum: 100 },
      session.token,
    )
    const list = (data && Array.isArray(data.events)) ? data.events : []
    return list.map((event) => ({
      id: event.id,
      name: stripTags(event.name),
      description: stripTags(event.description),
      timesort: Number(event.timesort) || 0,
      course: event.course && event.course.fullname ? stripTags(event.course.fullname) : '',
      action: event.action && event.action.name ? stripTags(event.action.name) : '',
    }))
  }

  async function loadCalendarEvents(session, from, to) {
    const list = await callFunction(
      'core_enrol_get_users_courses',
      { userid: session.profile && session.profile.userid },
      session.token,
    )
    const courses = Array.isArray(list) ? list : []
    const byId = new Map()
    for (const course of courses) byId.set(Number(course.id), stripTags(course.fullname))
    const courseids = courses.map((course) => course.id)
    const data = await callFunction('core_calendar_get_calendar_events', {
      'events[courseids]': courseids,
      'options[userevents]': 1,
      'options[siteevents]': 0,
      'options[timestart]': from,
      'options[timeend]': to,
    }, session.token)
    const events = (data && Array.isArray(data.events)) ? data.events : []
    return events.map((event) => ({
      id: event.id,
      name: stripTags(event.name),
      description: stripTags(event.description),
      timesort: Number(event.timestart) || 0,
      course: byId.get(Number(event.courseid)) || '',
      action: '',
    }))
  }

  // The mobile service does not always expose the action-event reader; probe it
  // once, then stay on whichever function this site actually answers.
  let eventsMode = ''

  function normalizeEventName(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\s+is due\b[\s\S]*$/, '')
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '')
  }

  // A calendar entry and an activity deadline for the same item arrive with
  // different names ("Recursion Lab is due" vs "Recursion Lab"), so compare the
  // normalized names on the same day instead of deduping on an id.
  function mergeEvents(calendar, activities) {
    const result = calendar.map((event) => ({ ...event, kind: event.kind || 'calendar' }))
    for (const activity of activities) {
      const key = normalizeEventName(activity.name)
      const duplicate = result.some((existing) => {
        if (existing.course !== activity.course) return false
        if (Math.abs(existing.timesort - activity.timesort) >= DAY_SECONDS) return false
        const other = normalizeEventName(existing.name)
        if (other === '' || key === '') return false
        return other.includes(key) || key.includes(other)
      })
      if (!duplicate) result.push(activity)
    }
    return result
  }

  const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 }
  const ANNOUNCEMENT_KEYWORDS = /(exam|quiz|test|midterm|mid-term|final|assignment|submission|deadline|due|考试|测验|期中|期末|作业|提交|截止)/i

  function monthFromToken(token) {
    return MONTHS[String(token || '').slice(0, 3).toLowerCase()] || 0
  }

  function dateStamp(year, month, day) {
    if (!year || month < 1 || month > 12 || day < 1 || day > 31) return 0
    // Local midnight: the announcement gives a calendar day, not an instant.
    return Math.floor(new Date(year, month - 1, day, 0, 0, 0).getTime() / 1000)
  }

  // Announcement prose carries dates in several shapes. A date without a year
  // that already passed by more than two months is assumed to mean next year.
  function parseDatesIn(text, nowSeconds) {
    const currentYear = new Date(nowSeconds * 1000).getFullYear()
    const found = []
    const push = (year, month, day) => {
      let stamp = dateStamp(year || currentYear, month, day)
      if (stamp === 0) return
      if (!year && stamp < nowSeconds - 60 * DAY_SECONDS) {
        stamp = dateStamp(currentYear + 1, month, day)
      }
      if (stamp > 0) found.push(stamp)
    }

    for (const match of text.matchAll(/\b(20\d{2})[\/\-.](\d{1,2})[\/\-.](\d{1,2})\b/g)) {
      push(Number(match[1]), Number(match[2]), Number(match[3]))
    }
    // 13/11/2026 — Malaysian university prose is day-first.
    for (const match of text.matchAll(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b/g)) {
      let year = Number(match[3])
      if (year < 100) year += 2000
      push(year, Number(match[2]), Number(match[1]))
    }
    // A bare 13/11 picks up the current year; the lookbehind keeps the tail of
    // a full 2026-12-01 from being read as another date, and only slash or dot
    // separators count so a time range like "2-6 pm" is not a date.
    for (const match of text.matchAll(/(?<![\d\/.])(\d{1,2})[\/.](\d{1,2})\b(?!\s*[\/.]\s*\d)/g)) {
      push(0, Number(match[2]), Number(match[1]))
    }
    for (const match of text.matchAll(/\b(\d{1,2})\s*(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s*(20\d{2})?/gi)) {
      push(match[3] ? Number(match[3]) : 0, monthFromToken(match[2]), Number(match[1]))
    }
    for (const match of text.matchAll(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(\d{1,2})(?!\d)(?:st|nd|rd|th)?,?\s*(20\d{2})?/gi)) {
      push(match[3] ? Number(match[3]) : 0, monthFromToken(match[1]), Number(match[2]))
    }
    for (const match of text.matchAll(/(\d{1,2})\s*月\s*(\d{1,2})\s*日?/g)) {
      push(0, Number(match[1]), Number(match[2]))
    }
    return Array.from(new Set(found))
  }

  // "from 2pm to 4pm" gives the start of a dated announcement.
  function parseTimeOfDay(text) {
    const match = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i.exec(text)
    if (!match) return -1
    const minute = match[2] ? Number(match[2]) : 0
    if (minute > 59) return -1
    let hour = Number(match[1]) % 12
    if (/pm/i.test(match[3])) hour += 12
    return hour * 3600 + minute * 60
  }

  let announcementCache = { at: 0, events: [] }
  let announcementDebug = []

  // Moodle keeps past enrolments, so an old term's news forum still answers.
  // A course that ended more than a month ago is not this term's business.
  function isActiveCourse(course, now) {
    const end = Number(course && course.enddate) || 0
    if (end === 0) return true
    return end >= now - 30 * DAY_SECONDS
  }

  async function loadAnnouncements(session, now, to) {
    if (Date.now() - announcementCache.at < 10 * 60 * 1000) return announcementCache.events
    announcementDebug = []

    const courses = await callFunction(
      'core_enrol_get_users_courses',
      { userid: session.profile && session.profile.userid },
      session.token,
    )
    const list = (Array.isArray(courses) ? courses : []).filter((course) => isActiveCourse(course, now))
    const byId = new Map()
    for (const course of list) byId.set(Number(course.id), stripTags(course.fullname))

    const forums = await callFunction('mod_forum_get_forums_by_courses', { courseids: list.map((course) => course.id) }, session.token)
    const newsForums = (Array.isArray(forums) ? forums : []).filter((forum) => forum && forum.type === 'news')

    const events = []
    for (const forum of newsForums) {
      let discussions = []
      try {
        const data = await callFunction('mod_forum_get_forum_discussions', { forumid: forum.id }, session.token)
        discussions = data && Array.isArray(data.discussions) ? data.discussions : []
      } catch {
        continue
      }
      for (const discussion of discussions) {
        const subject = stripTags(discussion.name)
        const body = stripTags(discussion.message)
        const text = subject + ' ' + body
        if (announcementDebug.length < 60) {
          announcementDebug.push({
            course: byId.get(Number(forum.course)) || '',
            subject: subject,
            chars: text.length,
            images: (String(discussion.message || '').match(/<img/gi) || []).length,
            hit: ANNOUNCEMENT_KEYWORDS.test(text) ? 1 : 0,
            dates: parseDatesIn(text, now).length,
          })
        }
        // Every dated announcement counts, not just exam and deadline ones: a
        // replacement class or a venue change is exactly what a schedule shows.
        const timeOffset = parseTimeOfDay(text)
        for (const stamp of parseDatesIn(text, now)) {
          const when = timeOffset >= 0 ? stamp + timeOffset : stamp
          if (when < now - 7 * DAY_SECONDS || when > to) continue
          events.push({
            id: 'announcement-' + discussion.id + '-' + when,
            name: subject || '课程公告',
            description: '',
            timesort: when,
            course: byId.get(Number(forum.course)) || '',
            action: '',
            kind: 'announcement',
          })
        }
      }
    }

    announcementCache = { at: Date.now(), events: events.slice(0, 80) }
    return announcementCache.events
  }

  async function loadActivityDeadlines(session, to) {
    const now = Math.floor(Date.now() / 1000)
    const courses = await callFunction(
      'core_enrol_get_users_courses',
      { userid: session.profile && session.profile.userid },
      session.token,
    )
    const list = (Array.isArray(courses) ? courses : []).filter((course) => isActiveCourse(course, now))
    const byId = new Map()
    for (const course of list) byId.set(Number(course.id), stripTags(course.fullname))
    const courseids = list.map((course) => course.id)
    const events = []
    const diagnostics = {}

    try {
      const data = await callFunction('mod_assign_get_assignments', { courseids }, session.token)
      const courseList = data && Array.isArray(data.courses) ? data.courses : []
      let found = 0
      for (const course of courseList) {
        for (const assignment of course.assignments || []) {
          const due = Number(assignment.duedate) || 0
          if (due <= 0 || due > to) continue
          found += 1
          events.push({
            id: 'assignment-' + assignment.id,
            name: stripTags(assignment.name),
            description: '',
            timesort: due,
            course: byId.get(Number(course.id)) || '',
            action: '',
            kind: 'assignment',
          })
        }
      }
      diagnostics.assignment = 'ok:' + found
    } catch (error) {
      diagnostics.assignment = error instanceof Error ? error.message : String(error)
    }

    try {
      const data = await callFunction('mod_quiz_get_quizzes_by_courses', { courseids }, session.token)
      const quizzes = data && Array.isArray(data.quizzes) ? data.quizzes : []
      let found = 0
      for (const quiz of quizzes) {
        const close = Number(quiz.timeclose) || 0
        if (close <= 0 || close > to) continue
        found += 1
        events.push({
          id: 'quiz-' + quiz.id,
          name: stripTags(quiz.name),
          description: '',
          timesort: close,
          course: byId.get(Number(quiz.course)) || '',
          action: '',
          kind: 'quiz',
        })
      }
      diagnostics.quiz = 'ok:' + found
    } catch (error) {
      diagnostics.quiz = error instanceof Error ? error.message : String(error)
    }

    return { events, diagnostics }
  }

  async function handleEvents(request, response, url) {
    const session = await requireSession()
    const now = Math.floor(Date.now() / 1000)
    const from = Number(url.searchParams.get('from')) || now - DAY_SECONDS
    const to = Number(url.searchParams.get('to')) || now + 60 * DAY_SECONDS

    let events = null
    if (eventsMode !== 'calendar') {
      try {
        events = await loadActionEvents(session, from, to)
        eventsMode = 'action'
      } catch (error) {
        if (error instanceof HttpError && error.status === 401) throw error
        eventsMode = 'calendar'
      }
    }
    if (events === null) events = await loadCalendarEvents(session, from, to)
    const sweep = await loadActivityDeadlines(session, to)
      .catch(() => ({ events: [], diagnostics: { sweep: 'failed' } }))
    let announcements = []
    try {
      announcements = await loadAnnouncements(session, now, to)
      sweep.diagnostics.announcement = 'ok:' + announcements.length
    } catch (error) {
      sweep.diagnostics.announcement = error instanceof Error ? error.message : String(error)
    }
    const manual = manualEvents.map((item) => ({
      id: item.id,
      name: item.name,
      description: '',
      timesort: item.timesort,
      course: item.course,
      action: '',
      kind: 'manual',
    }))
    events = mergeEvents(events, sweep.events.concat(announcements).concat(manual))
    events = events.filter((event) => event.timesort >= from && event.timesort <= to)
    if (ignoredEvents.length > 0) {
      const ignored = new Set(ignoredEvents)
      events = events.filter((event) => !ignored.has(String(event.id)))
    }
    events.sort((left, right) => left.timesort - right.timesort)
    send(response, 200, { from, to, mode: eventsMode, sources: sweep.diagnostics, announcementDebug, events })
  }

  async function handle(request, response) {
    const url = new URL(request.url || '/', 'http://localhost')
    const pathname = url.pathname
    try {
      if (pathname === API_PREFIX + '/status') {
        if (request.method !== 'GET') throw new HttpError(405, '只支持 GET')
        await handleStatus(response)
        return
      }
      if (pathname === API_PREFIX + '/login') {
        if (request.method !== 'POST') throw new HttpError(405, '只支持 POST')
        await handleLogin(request, response)
        return
      }
      if (pathname === API_PREFIX + '/logout') {
        if (request.method !== 'POST') throw new HttpError(405, '只支持 POST')
        await handleLogout(response)
        return
      }
      if (pathname === API_PREFIX + '/courses') {
        if (request.method !== 'GET') throw new HttpError(405, '只支持 GET')
        await handleCourses(response)
        return
      }
      if (pathname === API_PREFIX + '/contents') {
        if (request.method !== 'POST') throw new HttpError(405, '只支持 POST')
        await handleContents(request, response)
        return
      }
      if (pathname === API_PREFIX + '/download') {
        if (request.method !== 'POST') throw new HttpError(405, '只支持 POST')
        await handleDownload(request, response)
        return
      }
      if (pathname === API_PREFIX + '/reveal') {
        if (request.method !== 'POST') throw new HttpError(405, '只支持 POST')
        await handleReveal(request, response)
        return
      }
      if (pathname === API_PREFIX + '/settings') {
        if (request.method === 'GET') {
          await handleGetSettings(response)
          return
        }
        if (request.method === 'POST') {
          await handleSetSettings(request, response)
          return
        }
        throw new HttpError(405, '只支持 GET 或 POST')
      }
      if (pathname === API_PREFIX + '/pick') {
        if (request.method !== 'POST') throw new HttpError(405, '只支持 POST')
        await handlePickDirectory(response)
        return
      }
      if (pathname === API_PREFIX + '/manual-events') {
        await handleManualEvents(request, response)
        return
      }
      if (pathname === API_PREFIX + '/ignored-events') {
        await handleIgnoredEvents(request, response)
        return
      }
      if (pathname === API_PREFIX + '/events') {
        if (request.method !== 'GET') throw new HttpError(405, '只支持 GET')
        await handleEvents(request, response, url)
        return
      }
      throw new HttpError(404, '未知接口')
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500
      const message = error instanceof Error && error.message ? error.message : '未知错误'
      if (!response.headersSent) send(response, status, { error: message })
      else response.end()
    }
  }

  ctx.effect(() => {
    const dispose = ctx.webServer.register({ kind: 'prefix', path: API_PREFIX, handler: handle })
    return () => dispose()
  }, 'dsh-school moodle routes')
}
