# dsh-xmum-moodle

English | [中文](#中文)

[Xiamen University Malaysia](https://www.xmu.edu.my/) **Moodle** inside the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) sidebar: sign in, browse courses grouped by term, turn announcements and deadlines into a schedule, and batch-download course files.

It is a two-half Harness bundle — a Host plugin that talks to the Moodle Web Services API over `https://l.xmu.edu.my`, and a browser half that renders a `学校 / School` panel next to the shipped ones.

## Install

Not published to npm yet, so install straight from the repository:

```sh
dsh plugin add github:Langlijun666/dsh-xmum-moodle
```

Then restart DeepSeek Harness. A mortarboard icon appears in the sidebar; the panel has three tabs: **课程 / Courses**, **日程 / Schedule**, **设置 / Settings**.

## What it does

### Courses, grouped by term

Moodle returns every enrolment you ever had, in one flat list. The panel parses the term out of the course title and groups by it. XMUM titles spell the same term at least five different ways, all handled:

| Title as it appears | Parsed term |
|---|---|
| `BSC124 Linear Algebra 2026/04` | 2026-04 |
| `(2026-09)-DATA STRUCTURES(EEE211)` | 2026-09 |
| `COM202_Engineering Physics II 202609` | 2026-09 |
| `MPU1.1-I BAHASA MELAYU KOMUNIKASI 2 09/2025` | 2025-09 |
| `G0208 Introduction to Finance 2026/02` | 2026-02 |

Titles that carry no term land in a `未识别学期` group instead of being dropped. The term is stripped out of the folder name on download, because it is already a directory level.

Course contents open as week sections → modules → files, with empty weeks filtered out and HTML entities decoded, so a course does not render as a wall of text.

### Schedule

Three sources are merged, de-duplicated and shown on one timeline. Each row carries a tag saying where it came from.

- **Calendar** — `core_calendar_get_calendar_events`, falling back automatically when the site does not expose the mobile action-event reader
- **Deadlines** — `mod_assign_get_assignments` and `mod_quiz_get_quizzes_by_courses`, swept directly so an activity that never reached the calendar still shows up
- **Announcements** — every news-forum post is scanned for a date. `13/11/2026`, `27th Nov 2026`, `Nov.13`, `2026-12-01`, `11月13日` and a bare `13/11` are all understood, and an `am/pm` time in the body is taken as the start.

Two things it deliberately does not pretend to do:

- An announcement whose date lives **inside an image** cannot be read. Those are skipped, not guessed.
- A date that exists only in a classroom or a chat group is not in Moodle at all. **Add it yourself** in the schedule tab (name + time + course); manual events live beside the automatic ones and can be deleted.
- Anything the scanner gets wrong can be hidden with the **忽略 / Ignore** button, and restored from Settings.

Only courses that ended less than a month ago are scanned. Moodle never unenrols you, so an old term's news forum would otherwise keep injecting stale events.

### Downloads

Tick individual files, or download a whole course. Files land in a directory tree:

```
<download dir>/
  2026-09/
    COM205 Microelectronic Devices and Circuits Guo Hang/
      课件/   Lecture 11 Magnetic fields I.pdf
      作业/   Homework 5.pdf
      实验/   Lab Manual.pdf
```

Files are classified from their names — `考试 / 实验 / 作业 / 课件 / 资料 / 其他` — with the module and section name as a fallback. A second copy of the same file becomes `Chapter 6 (2).pdf` rather than overwriting the first.

The download directory is configurable in **设置 / Settings**, either with the system folder picker or by typing an absolute path. The default is `~/Downloads/Moodle`. After a download, a bar offers **打开文件 / 打开文件夹**, which reveals it in Explorer/Finder.

## Credentials and privacy

- Your Campus ID and password are used **once**, to exchange for a Moodle Web Services token, and are then dropped. Only the token is kept.
- The token is stored as a Harness **credential record** (`dsh-school/moodle` → a `grant` payload), not in the plugin's config file.
- Signing out deletes the local record. The token itself has no user-facing expiry on Moodle's side, so revoking it fully may need your IT department.
- Everything happens on your machine: the Host half calls Moodle directly, and the browser half only talks to `127.0.0.1` through the plugin's own `/school/api` routes.
- Nothing is uploaded anywhere.

## Requirements and limits

- Works against `https://l.xmu.edu.my` by default; another Moodle site can be pointed at with `siteUrl` in the bundle config, but the term parsing is tuned to XMUM's titles.
- The site must keep its Web Services (`moodle_mobile_app`) enabled — it does, because the official Moodle app depends on it.
- The site's own daily maintenance window (03:00–04:30 Malaysia time) will fail requests; that is Moodle, not the plugin.
- Announcement scanning costs one request per news forum, so the first schedule read of a session takes a few seconds and is cached for ten minutes.
- Read-only towards Moodle: it never submits assignments, posts, or changes anything.

## Development

The bundle is plain JavaScript, no build step:

```sh
git clone https://github.com/Langlijun666/dsh-xmum-moodle.git
```

Then point a profile at the checkout:

```sh
dsh plugin --profile <profile> add /absolute/path/to/dsh-xmum-moodle
```

- `index.js` — Host half: Moodle Web Services client, credential handling, download and reveal routes under `/school/api`
- `client.js` — browser half: sidebar icon, panel, schedule rendering, styles (theme tokens only)
- `cordis.patch.yml` — the Loader row; `siteUrl` lives here

Files you edit in the checkout reload through Harness HMR; a change to the Host half needs the plugin entry restarted.

## License

MIT — see [LICENSE](LICENSE).

---

## 中文

厦门大学马来西亚分校的 **Moodle** 搬进 DeepSeek Harness 侧边栏：登录、按学期浏览课程、把公告和截止日期读成日程、批量下载课件。

### 安装

还没发 npm，直接从仓库安装：

```sh
dsh plugin add github:Langlijun666/dsh-xmum-moodle
```

重启后侧边栏多一个学士帽图标，面板分三个页签：**课程 / 日程 / 设置**。

### 它做什么

**按学期分组**：Moodle 会把你所有学期的选课堆在一起。面板从课程名里解析学期——`2026/04`、`(2026-09)-`、`202609`、`09/2025`、`2026/02` 这几种写法都能认，认不出的单独归到「未识别学期」而不是丢掉。

**日程**：三个来源合并去重——Moodle 日历、作业/测验截止时间（直接扫活动，不依赖日历）、以及**课程公告正文里的日期**（支持 `13/11/2026`、`27th Nov 2026`、`Nov.13`、`2026-12-01`、`11月13日`，正文里的 `2pm` 会当作开始时间）。来源不同的条目带不同标签。

两件事它不假装能做到：**日期写在图片里的公告读不出来**；**只在课堂上或群里通知的日期，Moodle 里根本没有**。所以日程页支持**手动添加**事件，也支持对误判的条目点「忽略」。

只扫描结束不到一个月的课程——Moodle 不会自动退课，否则去年那门课的旧公告会一直往里塞。

**下载**：勾选单个文件，或整门课下载。落盘结构是 `学期 / 课程 / 类型 / 文件`，类型按文件名自动判定（考试/实验/作业/课件/资料/其他），同名文件自动加 `(2)` 不覆盖。下载目录在设置里可改，默认 `~/Downloads/Moodle`，下载完可以直接打开文件夹。

### 凭据

Campus ID 和密码只用来**换一次** Moodle 令牌，换完即丢弃，只留令牌。令牌存在 Harness 的凭据记录里（`dsh-school/moodle`），不写进配置文件。全程只和你本机的 `127.0.0.1` 通信，数据不出本地，也不会往 Moodle 提交任何东西。

### 许可证

MIT。
