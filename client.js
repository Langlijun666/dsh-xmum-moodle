window.__ModuleLoader__.load({
  id: 'dsh-xmum-moodle',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // Visual polish layered over the base rules above: the same selectors,
    // declared later, so these win without rewriting the block.
    const STYLE_OVERRIDES = [
      '.dsh-school{font-size:13px;line-height:1.55;letter-spacing:.005em}',
      '.dsh-school-header{padding:20px 24px 12px;gap:12px}',
      '.dsh-school-title{font-size:16px;font-weight:650;letter-spacing:-.01em;line-height:1.3}',
      '.dsh-school-sub{font-size:11.5px;letter-spacing:.01em}',
      '.dsh-school-user{font-size:11.5px;padding:3px 10px;border-radius:999px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);max-width:240px}',
      '.dsh-school-tabs{display:inline-flex;gap:2px;margin:0 24px 16px;padding:3px;border-radius:10px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);align-self:flex-start}',
      '.dsh-school-tab{padding:5px 14px;border-radius:8px;font-size:12px;transition:background .14s ease,color .14s ease}',
      '.dsh-school-tab.is-active{background:var(--dsw-alias-bg-base);font-weight:600;box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1)}',
      '.dsh-school-body{padding:2px 24px 32px}',
      '.dsh-school-body::-webkit-scrollbar{width:10px}',
      '.dsh-school-body::-webkit-scrollbar-track{background:transparent}',
      '.dsh-school-body::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2);border-radius:999px;border:3px solid transparent;background-clip:content-box}',
      '.dsh-school-body::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-label-secondary);background-clip:content-box;border:3px solid transparent}',
      '.dsh-school-btn{height:28px;padding:0 12px;border-radius:8px;font-size:12px;font-weight:500;display:inline-flex;align-items:center;justify-content:center;gap:4px;transition:background .14s ease,border-color .14s ease,color .14s ease}',
      '.dsh-school-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}',
      '.dsh-school-btn-sm{height:24px;padding:0 9px;font-size:11px;border-radius:7px}',
      '.dsh-school-btn-primary{font-weight:600}',
      '.dsh-school-hint{font-size:11.5px;line-height:1.65}',
      '.dsh-school-error{font-size:11.5px;line-height:1.6}',
      '.dsh-school-notice{margin:0 24px 12px;padding:9px 12px;border-radius:10px;font-size:11.5px;line-height:1.5}',
      '.dsh-school-group{margin-bottom:20px}',
      '.dsh-school-group-head{padding:7px 8px;margin-left:-8px;border-radius:8px;font-size:11.5px;letter-spacing:.04em;transition:background .14s ease}',
      '.dsh-school-group-head:hover{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}',
      '.dsh-school-group-name{font-weight:600}',
      '.dsh-school-group-count{font-size:10.5px;padding:1px 7px;border-radius:999px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1)}',
      '.dsh-school-group-body{padding-top:8px}',
      '.dsh-school-course{border-radius:12px;margin-bottom:8px;transition:border-color .14s ease}',
      '.dsh-school-course:hover{border-color:var(--dsw-alias-border-l2)}',
      '.dsh-school-course-head{padding:11px 14px;gap:10px;border-radius:12px}',
      '.dsh-school-course-name{font-size:13.5px;font-weight:500}',
      '.dsh-school-chevron{width:14px;font-size:11px;transition:transform .16s ease}',
      '.dsh-school-course-body{padding:2px 14px 14px 34px}',
      '.dsh-school-section{margin-top:16px}',
      '.dsh-school-section-name{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;opacity:.9}',
      '.dsh-school-module{padding:6px 0}',
      '.dsh-school-module-head{gap:9px}',
      '.dsh-school-tag{font-size:9.5px;font-weight:600;letter-spacing:.03em;padding:1px 7px;border-radius:6px}',
      '.dsh-school-module-name{font-size:12.5px;line-height:1.5}',
      '.dsh-school-files{gap:0;margin:2px 0 4px 10px}',
      '.dsh-school-file{padding:3px 8px;margin-left:-8px;border-radius:7px;transition:background .12s ease}',
      '.dsh-school-file:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsh-school-file-name{font-size:12px}',
      '.dsh-school-file-size{font-size:10.5px;opacity:.85}',
      '.dsh-school-cat{font-size:9.5px;font-weight:600;padding:0 5px;border-radius:5px;letter-spacing:.02em}',
      '.dsh-school-cats{gap:7px;margin:2px 0 12px}',
      '.dsh-school-chip{padding:3px 11px;font-size:11px;border-radius:999px;transition:background .14s ease,border-color .14s ease,color .14s ease}',
      '.dsh-school-chip:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}',
      '.dsh-school-day{margin-bottom:22px}',
      '.dsh-school-day-head{font-size:11px;letter-spacing:.05em;padding-bottom:7px;margin-bottom:2px;border-bottom:1px solid var(--dsw-alias-border-l1)}',
      '.dsh-school-event{padding:9px 0;gap:12px;align-items:flex-start}',
      '.dsh-school-event-time{width:46px;font-size:11.5px;padding-top:2px}',
      '.dsh-school-event-name{font-size:13px;line-height:1.5}',
      '.dsh-school-event-meta{font-size:10.5px;margin-top:3px}',
      '.dsh-school-addevent{padding:12px;border-radius:12px;gap:8px}',
      '.dsh-school-event-ignore,.dsh-school-event-del{opacity:.55;transition:opacity .14s ease,color .14s ease,border-color .14s ease}',
      '.dsh-school-event:hover .dsh-school-event-ignore,.dsh-school-event:hover .dsh-school-event-del{opacity:1}',
      '.dsh-school-input{height:32px;padding:0 11px;border-radius:9px;font-size:12.5px;transition:border-color .14s ease,background .14s ease}',
      '.dsh-school-login{padding-top:7vh}',
      '.dsh-school-card{padding:24px;border-radius:14px;gap:14px;max-width:370px}',
      '.dsh-school-card-title{font-size:15px;font-weight:650}',
      '.dsh-school-setting{padding:16px;border-radius:12px;gap:11px}',
      '.dsh-school-setting-path{font-size:11.5px;padding:8px 10px;border-radius:8px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}',
      '.dsh-school-setting-label{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}',
      '.dsh-school-selbar{padding:12px 24px;font-size:12px}',
      '.dsh-school-dlbar{margin:0 24px 12px;padding:10px 12px;border-radius:10px;font-size:11.5px}',
      '.dsh-school-empty{padding:56px 0;font-size:12.5px;line-height:1.7}',
    ];

    const CSS = [
      '.dsh-school{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}',
      '.dsh-school-header{display:flex;align-items:center;gap:10px;padding:16px 20px 12px}',
      '.dsh-school-heading{display:flex;flex-direction:column;gap:2px;min-width:0}',
      '.dsh-school-title{font-size:15px;font-weight:600}',
      '.dsh-school-sub{font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dsh-school-spacer{flex:1 1 auto}',
      '.dsh-school-user{font-size:12px;color:var(--dsw-alias-label-secondary);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsh-school-tabs{display:flex;gap:6px;padding:0 20px 10px;border-bottom:1px solid var(--dsw-alias-border-l1)}',
      '.dsh-school-tab{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:4px 10px;border-radius:999px;cursor:pointer}',
      '.dsh-school-tab:hover{color:var(--dsw-alias-label-primary)}',
      '.dsh-school-tab.is-active{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:600}',
      '.dsh-school-notice{margin:10px 20px 0;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);font-size:12px;color:var(--dsw-alias-label-secondary);word-break:break-word}',
      '.dsh-school-body{flex:1 1 auto;min-height:0;overflow:auto;padding:16px 20px 28px}',
      '.dsh-school-btn{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:5px 12px;font-size:12px;cursor:pointer;white-space:nowrap;flex:0 0 auto}',
      '.dsh-school-btn:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}',
      '.dsh-school-btn:disabled{opacity:.5;cursor:default}',
      '.dsh-school-btn-sm{padding:2px 8px;font-size:11px}',
      '.dsh-school-btn-primary{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary);font-weight:600}',
      '.dsh-school-btn-primary:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}',
      '.dsh-school-login{display:flex;justify-content:center;padding-top:24px}',
      '.dsh-school-card{width:100%;max-width:380px;display:flex;flex-direction:column;gap:12px;padding:20px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}',
      '.dsh-school-card-title{font-size:14px;font-weight:600}',
      '.dsh-school-hint{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.6}',
      '.dsh-school-field{display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dsh-school-input{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;outline:none}',
      '.dsh-school-input:focus{border-color:var(--dsw-alias-brand-primary)}',
      '.dsh-school-error{font-size:12px;color:var(--dsw-alias-state-error-primary);word-break:break-word}',
      '.dsh-school-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:10px}',
      '.dsh-school-course{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;margin-bottom:8px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}',
      '.dsh-school-course-head{display:flex;align-items:center;gap:8px;width:100%;padding:10px 12px;background:transparent;border:0;color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.dsh-school-course-head:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsh-school-chevron{width:12px;color:var(--dsw-alias-label-secondary);transition:transform .12s ease;display:inline-block}',
      '.dsh-school-chevron.is-open{transform:rotate(90deg)}',
      '.dsh-school-course-name{flex:1 1 auto;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsh-school-course-body{padding:4px 12px 12px 32px;border-top:1px solid var(--dsw-alias-border-l1)}',
      '.dsh-school-course-actions{display:flex;justify-content:flex-end;padding:0 0 4px}',
      '.dsh-school-section{margin-top:10px}',
      '.dsh-school-section-name{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);margin-bottom:6px}',
      '.dsh-school-module{padding:5px 0}',
      '.dsh-school-module-head{display:flex;align-items:baseline;gap:8px;min-width:0}',
      '.dsh-school-tag{flex:0 0 auto;font-size:10px;line-height:1.5;padding:0 6px;border-radius:5px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap}',
      '.dsh-school-module-name{font-size:13px;word-break:break-word;flex:1 1 auto;min-width:0}',
      '.dsh-school-files{display:flex;flex-direction:column;gap:2px;margin:4px 0 6px 12px}',
      '.dsh-school-file{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--dsw-alias-label-secondary);min-width:0;cursor:pointer}',
      '.dsh-school-check{flex:0 0 auto;margin:0;accent-color:var(--dsw-alias-brand-primary)}',
      '.dsh-school-file-name{color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsh-school-file-size{font-size:11px;white-space:nowrap}',
      '.dsh-school-empty{padding:24px 0;text-align:center;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dsh-school-group{margin-bottom:14px}',
      '.dsh-school-group-head{display:flex;align-items:center;gap:8px;width:100%;padding:6px 2px;background:transparent;border:0;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;font-weight:600;letter-spacing:.02em;text-align:left;cursor:pointer}',
      '.dsh-school-group-head:hover{color:var(--dsw-alias-brand-primary)}',
      '.dsh-school-group-name{flex:1 1 auto}',
      '.dsh-school-group-count{font-weight:400;white-space:nowrap}',
      '.dsh-school-group-body{padding-top:6px}',
      '.dsh-school-selbar{display:flex;align-items:center;gap:8px;padding:10px 20px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);font-size:12px}',
      '.dsh-school-day{margin-bottom:14px}',
      '.dsh-school-day-head{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);margin-bottom:6px}',
      '.dsh-school-event{display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}',
      '.dsh-school-event:last-child{border-bottom:0}',
      '.dsh-school-event-time{flex:0 0 auto;width:42px;font-size:12px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}',
      '.dsh-school-event-body{flex:1 1 auto;min-width:0}',
      '.dsh-school-event-name{font-size:13px;word-break:break-word}',
      '.dsh-school-event-meta{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsh-school-addevent{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px;padding:10px;border:1px dashed var(--dsw-alias-border-l1);border-radius:10px}',
      '.dsh-school-addevent .dsh-school-input{flex:1 1 130px;min-width:0}',
      '.dsh-school-event-del{flex:0 0 auto;border:0;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:15px;line-height:1;padding:2px 4px}',
      '.dsh-school-event-del:hover{color:var(--dsw-alias-state-error-primary)}',
      '.dsh-school-event-ignore{flex:0 0 auto;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:5px;padding:0 6px;font-size:10px;line-height:1.7;cursor:pointer;white-space:nowrap}',
      '.dsh-school-event-ignore:hover{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}',
      '.dsh-school-cats{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 8px}',
      '.dsh-school-chip{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 9px;font-size:11px;cursor:pointer;white-space:nowrap}',
      '.dsh-school-chip:hover{color:var(--dsw-alias-label-primary)}',
      '.dsh-school-chip.is-active{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}',
      '.dsh-school-cat{flex:0 0 auto;font-size:10px;line-height:1.5;padding:0 5px;border-radius:4px;border:1px solid currentColor;white-space:nowrap;opacity:.8}',
      '.dsh-school-cat.tone-lesson{color:var(--dsw-alias-brand-primary)}',
      '.dsh-school-cat.tone-homework{color:var(--dsw-alias-state-warn-primary)}',
      '.dsh-school-cat.tone-lab{color:var(--dsw-alias-state-success-primary)}',
      '.dsh-school-cat.tone-exam{color:var(--dsw-alias-state-error-primary)}',
      '.dsh-school-cat.tone-muted{color:var(--dsw-alias-label-secondary)}',
      '.dsh-school-dlbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 20px 0;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dsh-school-dlbar-path{flex:1 1 160px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsh-school-setting{display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);margin-bottom:12px}',
      '.dsh-school-setting-label{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}',
      '.dsh-school-setting-path{font-size:12px;word-break:break-all;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:6px 8px;color:var(--dsw-alias-label-primary)}',
      '.dsh-school-setting-actions{display:flex;gap:8px;flex-wrap:wrap}',
      '.dsh-school-setting-manual{display:flex;gap:8px;align-items:center}',
      '.dsh-school-setting-manual .dsh-school-input{flex:1 1 auto;min-width:0}',
    ].concat(STYLE_OVERRIDES).join('\n');

    async function callApi(path, body) {
      const init = body === undefined
        ? { method: 'GET' }
        : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) };
      const response = await fetch('/school/api' + path, init);
      let data = null;
      try {
        data = await response.json();
      } catch (error) {
        data = null;
      }
      if (!response.ok) {
        const failure = new Error((data && data.error) || 'HTTP ' + response.status);
        failure.status = response.status;
        throw failure;
      }
      return data || {};
    }

    function formatSize(bytes) {
      const value = Number(bytes);
      if (!Number.isFinite(value) || value <= 0) return '';
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = value;
      let index = 0;
      while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index += 1;
      }
      const text = size >= 10 || index === 0 ? String(Math.round(size)) : size.toFixed(1);
      return text + ' ' + units[index];
    }

    function pad2(value) {
      return value < 10 ? '0' + value : String(value);
    }

    // XMUM course titles bury the term in a handful of shapes: 2026/04, 2026-09,
    // 202602, 202609, 09/2025. A term is one of the three yearly intakes, 02/04/09.
    const TERM_SEPARATED = /(20\d{2})[\/\-._](0?[249])(?![0-9])/;
    const TERM_TRAILING = /(^|[^0-9])(0?[249])[\/\-._](20\d{2})(?![0-9])/;
    const TERM_COMPACT = /(^|[^0-9])(20\d{2})(0[249])(?![0-9])/;

    function parseTerm() {
      for (let index = 0; index < arguments.length; index += 1) {
        const text = String(arguments[index] || '');
        if (text === '') continue;
        let match = TERM_SEPARATED.exec(text);
        if (match) return { year: Number(match[1]), month: Number(match[2]) };
        match = TERM_TRAILING.exec(text);
        if (match) return { year: Number(match[3]), month: Number(match[2]) };
        match = TERM_COMPACT.exec(text);
        if (match) return { year: Number(match[2]), month: Number(match[3]) };
      }
      return null;
    }

    function buildGroups(courses) {
      const buckets = new Map();
      const loose = [];
      for (const course of courses) {
        const term = parseTerm(course.fullname, course.shortname);
        if (term === null) {
          loose.push(course);
          continue;
        }
        const key = term.year + '-' + pad2(term.month);
        let bucket = buckets.get(key);
        if (bucket === undefined) {
          bucket = { key, year: term.year, month: term.month, label: '', courses: [] };
          buckets.set(key, bucket);
        }
        bucket.courses.push(course);
      }
      const groups = Array.from(buckets.values())
        .sort((left, right) => right.year - left.year || right.month - left.month);
      for (const group of groups) group.label = group.year + ' / ' + pad2(group.month) + ' 学期';
      if (loose.length > 0) groups.push({ key: 'unknown', year: 0, month: 0, label: '未识别学期', courses: loose });
      return groups;
    }

    const MODULE_LABELS = {
      resource: '文件',
      folder: '文件夹',
      url: '链接',
      forum: '论坛',
      assign: '作业',
      quiz: '测验',
      page: '页面',
      label: '说明',
      book: '手册',
      lesson: '课程',
      choice: '投票',
      feedback: '反馈',
      workshop: '工作坊',
      wiki: '词条',
      glossary: '词条',
      scorm: '课件包',
      imscp: '课件包',
      chat: '聊天',
      attendance: '签到',
    };

    function decodeEntities(value) {
      return String(value || '')
        .replace(/&#x([0-9a-f]+);/gi, (whole, hex) => {
          const code = parseInt(hex, 16);
          return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
        })
        .replace(/&#(\d+);/g, (whole, digits) => {
          const code = parseInt(digits, 10);
          return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
        })
        .replace(/&nbsp;/gi, ' ')
        .replace(/&quot;/gi, '"')
        .replace(/&apos;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&amp;/gi, '&');
    }

    // Moodle names arrive as HTML fragments or entity-escaped text; strip the
    // tags first so an entity that decodes to '<' is not then read as markup.
    function cleanText(value) {
      return decodeEntities(String(value || '').replace(/<[^>]*>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Name-based classification of course materials. Order matters: the more
    // specific verdicts win, so "Lab 1 solution" lands under 实验, not 作业.
    const FILE_CATEGORIES = [
      { key: 'exam', label: '考试', tone: 'exam', test: /(exam|quiz|midterm|final\b|\btest\b)/i },
      { key: 'lab', label: '实验', tone: 'lab', test: /(\blab\b|laborator|experiment|practical)/i },
      { key: 'homework', label: '作业', tone: 'homework', test: /(homework|\bhw\b|\bhw\d|assignment|tutorial|exercise|solution|answer)/i },
      { key: 'lecture', label: '课件', tone: 'lesson', test: /(lecture|slide|\bnotes?\b|chapter|\bch\s?\d|presentation|讲义|课件)/i },
      { key: 'material', label: '资料', tone: 'muted', test: /(syllabus|course structure|outline|guidelin|marking scheme|template|record|form|manual)/i },
    ];
    const CATEGORY_OTHER = { key: 'other', label: '其他', tone: 'muted' };

    function classifyFile(fileName, moduleName, sectionName) {
      const primary = String(fileName || '');
      for (const category of FILE_CATEGORIES) {
        if (category.test.test(primary)) return category;
      }
      const secondary = String(moduleName || '') + ' ' + String(sectionName || '');
      for (const category of FILE_CATEGORIES) {
        if (category.test.test(secondary)) return category;
      }
      return CATEGORY_OTHER;
    }

    function termFolder(course) {
      const term = parseTerm(course.fullname, course.shortname);
      return term === null ? '未识别学期' : term.year + '-' + pad2(term.month);
    }

    // The term is already a folder level, so drop it from the course folder name:
    // "EEE203 Instrumentation 2026/09 Lian" becomes "EEE203 Instrumentation Lian".
    function courseFolderName(course) {
      const raw = cleanText(course.fullname) || '未命名课程';
      const stripped = raw
        .replace(/(20\d{2})[\/\-._](0?[249])(?![0-9])/g, ' ')
        .replace(/(^|[^0-9])(0?[249])[\/\-._](20\d{2})(?![0-9])/g, ' ')
        .replace(/(^|[^0-9])(20\d{2})(0[249])(?![0-9])/g, ' ')
        .replace(/\(\s*\)/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/^[\s\-_.,;:]+/, '')
        .replace(/[\s\-_.,;:]+$/, '')
        .trim();
      return stripped === '' ? raw : stripped;
    }

    function itemsFromDetail(course, detail) {
      const items = [];
      if (!detail || !Array.isArray(detail.sections)) return items;
      const courseName = courseFolderName(course);
      const term = termFolder(course);
      for (const section of detail.sections) {
        const sectionName = cleanText(section.name) || '未分组';
        for (const module of section.modules || []) {
          for (const file of module.files || []) {
            if (typeof file.url !== 'string' || file.url === '') continue;
            const name = cleanText(file.name) || 'file';
            items.push({
              url: file.url,
              name: name,
              course: courseName,
              section: sectionName,
              term: term,
              category: classifyFile(name, module.name, section.name).label,
            });
          }
        }
      }
      return items;
    }

    const EVENT_KINDS = { assignment: '作业', quiz: '测验', calendar: '日历', announcement: '公告', manual: '手动' };

    const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    function dayKey(seconds) {
      const date = new Date(seconds * 1000);
      return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
    }

    function formatTime(seconds) {
      const date = new Date(seconds * 1000);
      return pad2(date.getHours()) + ':' + pad2(date.getMinutes());
    }

    function formatClock(ms) {
      const date = new Date(ms);
      return pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + ' ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes());
    }

    function formatDayLabel(key) {
      const parts = key.split('-').map(Number);
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      const text = parts[1] + '月' + parts[2] + '日 ' + WEEKDAYS[date.getDay()];
      const now = new Date();
      const todayKey = now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());
      if (key === todayKey) return '今天 · ' + text;
      const tomorrow = new Date(now.getTime() + 86400000);
      const tomorrowKey = tomorrow.getFullYear() + '-' + pad2(tomorrow.getMonth() + 1) + '-' + pad2(tomorrow.getDate());
      if (key === tomorrowKey) return '明天 · ' + text;
      return text;
    }

    function SchoolIcon(props) {
      const size = (props && props.size) || 18;
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': true,
        style: { display: 'block', color: 'currentColor' },
      },
        h('path', { d: 'M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z', stroke: 'currentColor', strokeWidth: 1.6, strokeLinejoin: 'round' }),
        h('path', { d: 'M6.5 10.8V15c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.2', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        h('path', { d: 'M20.5 9.4v4.4', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
      );
    }

    function SchoolPanel() {
      const [phase, setPhase] = React.useState('loading');
      const [profile, setProfile] = React.useState(null);
      const [courses, setCourses] = React.useState([]);
      const [form, setForm] = React.useState({ username: '', password: '' });
      const [busy, setBusy] = React.useState(false);
      const [error, setError] = React.useState('');
      const [tab, setTab] = React.useState('courses');
      const [openGroup, setOpenGroup] = React.useState(null);
      const [openCourse, setOpenCourse] = React.useState(null);
      const [contents, setContents] = React.useState({});
      const [selection, setSelection] = React.useState({});
      const [downloading, setDownloading] = React.useState(null);
      const [notice, setNotice] = React.useState('');
      const [events, setEvents] = React.useState({ status: 'idle', list: [], error: '' });
      const [fileFilter, setFileFilter] = React.useState('all');
      const [downloadDir, setDownloadDir] = React.useState('');
      const [lastDownload, setLastDownload] = React.useState(null);
      const [settingsDir, setSettingsDir] = React.useState('');
      const [settingsInput, setSettingsInput] = React.useState('');
      const [settingsBusy, setSettingsBusy] = React.useState(false);
      const [manualEvents, setManualEvents] = React.useState([]);
      const [draft, setDraft] = React.useState({ name: '', when: '', course: '' });
      const [ignoredIds, setIgnoredIds] = React.useState([]);

      const groups = React.useMemo(() => buildGroups(courses), [courses]);
      const groupSeeded = React.useRef(false);
      React.useEffect(() => {
        if (groupSeeded.current || groups.length === 0) return;
        groupSeeded.current = true;
        setOpenGroup(groups[0].key);
      }, [groups]);

      const bootstrap = React.useCallback(async () => {
        setPhase('loading');
        setError('');
        try {
          const status = await callApi('/status');
          if (!status || status.loggedIn !== true) {
            setPhase('login');
            return;
          }
          if (status.downloadDir) setDownloadDir(status.downloadDir);
          setProfile(status.profile || null);
          const data = await callApi('/courses');
          setCourses(Array.isArray(data.courses) ? data.courses : []);
          setPhase('ready');
        } catch (failure) {
          if (failure && failure.status === 401) {
            setPhase('login');
            return;
          }
          setError((failure && failure.message) || '无法连接本地服务');
          setPhase('error');
        }
      }, []);

      React.useEffect(() => {
        bootstrap();
      }, [bootstrap]);

      const loadEvents = React.useCallback(async (force) => {
        setEvents((previous) => ({ status: 'loading', list: previous.list, error: '' }));
        try {
          const [data, manual, ignored] = await Promise.all([
            callApi('/events' + (force ? '?refresh=1' : '')),
            callApi('/manual-events'),
            callApi('/ignored-events'),
          ]);
          setManualEvents(Array.isArray(manual.events) ? manual.events : []);
          setIgnoredIds(Array.isArray(ignored.ids) ? ignored.ids : []);
          setEvents({
            status: 'ready',
            list: Array.isArray(data.events) ? data.events : [],
            fetchedAt: Number(data.fetchedAt) || 0,
            error: '',
          });
        } catch (failure) {
          if (failure && failure.status === 401) {
            setPhase('login');
            setProfile(null);
            return;
          }
          setEvents({ status: 'failed', list: [], error: (failure && failure.message) || '读取日程失败' });
        }
      }, []);

      const saveManual = async (list) => {
        try {
          const result = await callApi('/manual-events', { events: list });
          setManualEvents(Array.isArray(result.events) ? result.events : []);
          await loadEvents();
        } catch (failure) {
          setNotice('保存失败：' + ((failure && failure.message) || '未知错误'));
        }
      };

      const saveIgnored = async (ids) => {
        try {
          const result = await callApi('/ignored-events', { ids });
          setIgnoredIds(Array.isArray(result.ids) ? result.ids : []);
          await loadEvents();
        } catch (failure) {
          setNotice('保存失败：' + ((failure && failure.message) || '未知错误'));
        }
      };

      const ignoreEvent = (event) => {
        const id = String(event.id);
        if (ignoredIds.includes(id)) return;
        saveIgnored(ignoredIds.concat([id]));
      };

      const addManual = async () => {
        const name = draft.name.trim();
        if (name === '' || draft.when === '') return;
        const timesort = Math.floor(new Date(draft.when).getTime() / 1000);
        if (!Number.isFinite(timesort)) {
          setNotice('日期格式不正确');
          return;
        }
        const next = manualEvents.concat([{
          id: 'manual-' + Date.now(),
          name: name,
          timesort: timesort,
          course: draft.course,
        }]);
        setDraft({ name: '', when: '', course: '' });
        await saveManual(next);
      };

      React.useEffect(() => {
        if (tab !== 'schedule') return;
        if (events.status === 'idle') loadEvents();
      }, [tab, events.status, loadEvents]);

      React.useEffect(() => {
        if (tab !== 'settings' || settingsDir !== '') return;
        callApi('/settings').then((data) => {
          setSettingsDir(data.downloadDir || '');
          setSettingsInput(data.downloadDir || '');
        }).catch((failure) => {
          setNotice('读取设置失败：' + ((failure && failure.message) || '未知错误'));
        });
      }, [tab, settingsDir]);

      const refreshCourses = async () => {
        setBusy(true);
        setError('');
        setNotice('');
        try {
          const data = await callApi('/courses');
          setCourses(Array.isArray(data.courses) ? data.courses : []);
          setContents({});
          setOpenCourse(null);
          setSelection({});
          setEvents({ status: 'idle', list: [], error: '' });
        } catch (failure) {
          if (failure && failure.status === 401) {
            setPhase('login');
            setProfile(null);
          } else {
            setError((failure && failure.message) || '刷新失败');
          }
        } finally {
          setBusy(false);
        }
      };

      const submit = async (event) => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');
        try {
          const result = await callApi('/login', { username: form.username, password: form.password });
          setProfile(result.profile || null);
          setForm({ username: form.username, password: '' });
          const data = await callApi('/courses');
          setCourses(Array.isArray(data.courses) ? data.courses : []);
          setPhase('ready');
        } catch (failure) {
          setError((failure && failure.message) || '登录失败');
        } finally {
          setBusy(false);
        }
      };

      const logout = async () => {
        setBusy(true);
        try {
          await callApi('/logout', {});
        } catch (failure) {
          // A failed sign-out still clears the local view.
        }
        setBusy(false);
        setProfile(null);
        setCourses([]);
        setContents({});
        setOpenCourse(null);
        setSelection({});
        setForm({ username: '', password: '' });
        setNotice('');
        setEvents({ status: 'idle', list: [], error: '' });
        setTab('courses');
        setPhase('login');
      };

      const loadContents = async (course) => {
        const key = String(course.id);
        setContents((previous) => Object.assign({}, previous, { [key]: { status: 'loading' } }));
        try {
          const data = await callApi('/contents', { courseid: course.id });
          const detail = { status: 'ready', sections: Array.isArray(data.sections) ? data.sections : [] };
          setContents((previous) => Object.assign({}, previous, { [key]: detail }));
          return detail;
        } catch (failure) {
          if (failure && failure.status === 401) {
            setPhase('login');
            setProfile(null);
            setError('登录状态已失效，请重新登录');
            return null;
          }
          setContents((previous) => Object.assign({}, previous, {
            [key]: { status: 'failed', error: (failure && failure.message) || '加载失败' },
          }));
          return null;
        }
      };

      const toggleCourse = async (course) => {
        const key = String(course.id);
        if (openCourse === key) {
          setOpenCourse(null);
          return;
        }
        setOpenCourse(key);
        setFileFilter('all');
        const existing = contents[key];
        if (existing && existing.status === 'ready') return;
        await loadContents(course);
      };

      const toggleFile = (item) => {
        setSelection((previous) => {
          const next = Object.assign({}, previous);
          if (next[item.url]) delete next[item.url];
          else next[item.url] = item;
          return next;
        });
      };

      const runDownload = async (items) => {
        if (!items || items.length === 0) return;
        setDownloading({ label: '正在下载 ' + items.length + ' 个文件…' });
        setNotice('');
        setLastDownload(null);
        try {
          const result = await callApi('/download', { files: items });
          const list = Array.isArray(result.results) ? result.results : [];
          const saved = list.filter((entry) => entry.ok);
          const failed = list.length - saved.length;
          if (result.root) setDownloadDir(result.root);
          if (saved.length > 0) {
            setLastDownload({ root: result.root || '', items: saved });
            setNotice(failed > 0 ? '有 ' + failed + ' 个文件下载失败' : '');
          } else {
            const firstError = list.find((entry) => !entry.ok && entry.error);
            setNotice('下载失败：' + (firstError ? firstError.error : '未知错误'));
          }
          setSelection({});
        } catch (failure) {
          setNotice('下载失败：' + ((failure && failure.message) || '未知错误'));
        } finally {
          setDownloading(null);
        }
      };

      const reveal = async (target, mode) => {
        setNotice('');
        try {
          const result = await callApi('/reveal', { path: target, mode: mode || 'folder' });
          setNotice('已打开：' + (result.target || target));
        } catch (failure) {
          setNotice('打开失败：' + ((failure && failure.message) || '未知错误'));
        }
      };

      const applyDirectory = async (directory) => {
        setSettingsBusy(true);
        setNotice('');
        try {
          const result = await callApi('/settings', { downloadDir: directory });
          const next = result.downloadDir || '';
          setSettingsDir(next);
          setSettingsInput(next);
          setDownloadDir(next);
          setLastDownload(null);
          setNotice('下载目录已更新：' + next);
        } catch (failure) {
          setNotice('保存失败：' + ((failure && failure.message) || '未知错误'));
        } finally {
          setSettingsBusy(false);
        }
      };

      const pickDirectory = async () => {
        setSettingsBusy(true);
        setNotice('');
        try {
          const result = await callApi('/pick', {});
          if (result.path) await applyDirectory(result.path);
        } catch (failure) {
          setNotice((failure && failure.message) || '选择目录失败');
        } finally {
          setSettingsBusy(false);
        }
      };

      const downloadCourse = async (course) => {
        const key = String(course.id);
        let detail = contents[key];
        if (!detail || detail.status !== 'ready') {
          setDownloading({ label: '正在读取课程文件…' });
          detail = await loadContents(course);
          setDownloading(null);
        }
        if (!detail) return;
        const items = itemsFromDetail(course, detail);
        if (items.length === 0) {
          setNotice('这门课没有可下载的文件');
          return;
        }
        await runDownload(items);
      };

      const selectedItems = Object.keys(selection).map((key) => selection[key]);

      const renderFiles = (module, moduleIndex, course, sectionName) => {
        const files = Array.isArray(module.files) ? module.files : [];
        if (files.length === 0) return null;
        return h('div', { className: 'dsh-school-files', key: 'files-' + moduleIndex },
          files.map((file, fileIndex) => {
            const name = cleanText(file.name) || '未命名文件';
            const category = classifyFile(name, module.name, sectionName);
            const downloadable = typeof file.url === 'string' && file.url !== '';
            const item = downloadable
              ? {
                  url: file.url,
                  name: name,
                  course: courseFolderName(course),
                  section: sectionName,
                  term: termFolder(course),
                  category: category.label,
                }
              : null;
            return h('label', { className: 'dsh-school-file', key: 'file-' + fileIndex },
              downloadable
                ? h('input', {
                    className: 'dsh-school-check',
                    type: 'checkbox',
                    checked: Boolean(selection[file.url]),
                    onChange: () => toggleFile(item),
                  })
                : null,
              h('span', { className: 'dsh-school-cat tone-' + category.tone }, category.label),
              h('span', { className: 'dsh-school-file-name' }, name),
              h('span', { className: 'dsh-school-file-size' }, formatSize(file.size)),
            );
          }),
        );
      };

      const renderDetail = (course, detail) => {
        if (!detail || detail.status === 'loading') return h('div', { className: 'dsh-school-hint' }, '加载中…');
        if (detail.status === 'failed') return h('div', { className: 'dsh-school-error' }, detail.error || '加载失败');
        const all = Array.isArray(detail.sections) ? detail.sections : [];
        // Moodle courses carry one section per teaching week, and most of them
        // stay empty; rendering those is what turns a course into a wall of text.
        const sections = all.filter((section) => Array.isArray(section.modules) && section.modules.length > 0);
        const total = itemsFromDetail(course, detail).length;
        const head = total > 0
          ? h('div', { className: 'dsh-school-course-actions' },
              h('button', {
                className: 'dsh-school-btn dsh-school-btn-sm',
                type: 'button',
                onClick: () => downloadCourse(course),
                disabled: downloading !== null,
              }, '下载本课程 (' + total + ')'),
            )
          : null;
        if (sections.length === 0) {
          return h('div', null, head, h('div', { className: 'dsh-school-hint' }, '这门课还没有上传材料'));
        }

        const counts = Object.create(null);
        for (const section of sections) {
          for (const module of section.modules) {
            for (const file of module.files || []) {
              const key = classifyFile(cleanText(file.name), module.name, section.name).key;
              counts[key] = (counts[key] || 0) + 1;
            }
          }
        }
        const chips = [{ key: 'all', label: '全部', count: total }];
        for (const category of FILE_CATEGORIES) {
          if (counts[category.key]) chips.push({ key: category.key, label: category.label, count: counts[category.key] });
        }
        if (counts.other) chips.push({ key: 'other', label: '其他', count: counts.other });
        const chipBar = chips.length > 2
          ? h('div', { className: 'dsh-school-cats' }, chips.map((chip) => h('button', {
              key: chip.key,
              className: 'dsh-school-chip' + (fileFilter === chip.key ? ' is-active' : ''),
              type: 'button',
              onClick: () => setFileFilter(chip.key),
            }, chip.label + ' ' + chip.count)))
          : null;

        const visible = fileFilter === 'all'
          ? sections
          : sections
              .map((section) => ({
                ...section,
                modules: section.modules
                  .map((module) => ({
                    ...module,
                    files: (module.files || []).filter((file) => {
                      return classifyFile(cleanText(file.name), module.name, section.name).key === fileFilter;
                    }),
                  }))
                  .filter((module) => module.files.length > 0),
              }))
              .filter((section) => section.modules.length > 0);

        if (visible.length === 0) {
          return h('div', null, head, chipBar, h('div', { className: 'dsh-school-hint' }, '这一类没有文件'));
        }

        return h('div', null,
          head,
          chipBar,
          visible.map((section, sectionIndex) => {
            const sectionName = cleanText(section.name) || '未分组';
            return h('div', { className: 'dsh-school-section', key: 'section-' + sectionIndex },
              h('div', { className: 'dsh-school-section-name' }, cleanText(section.name) || '第 ' + (sectionIndex + 1) + ' 部分'),
              section.modules.map((module, moduleIndex) => {
                const tag = MODULE_LABELS[module.modname] || module.modname || '内容';
                const name = cleanText(module.name) || '未命名项目';
                return h('div', { className: 'dsh-school-module', key: 'module-' + moduleIndex },
                  h('div', { className: 'dsh-school-module-head' },
                    h('span', { className: 'dsh-school-tag' }, tag),
                    h('span', { className: 'dsh-school-module-name' }, name),
                  ),
                  renderFiles(module, moduleIndex, course, sectionName),
                );
              }),
            );
          }),
        );
      };

      const renderCourse = (course) => {
        const key = String(course.id);
        const open = openCourse === key;
        return h('div', { className: 'dsh-school-course', key: key },
          h('button', { className: 'dsh-school-course-head', type: 'button', onClick: () => toggleCourse(course) },
            h('span', { className: 'dsh-school-chevron' + (open ? ' is-open' : '') }, '▸'),
            h('span', { className: 'dsh-school-course-name' }, course.fullname || course.shortname || '课程 ' + key),
          ),
          open ? h('div', { className: 'dsh-school-course-body' }, renderDetail(course, contents[key])) : null,
        );
      };

      const renderGroup = (group) => {
        const open = openGroup === group.key;
        return h('div', { className: 'dsh-school-group', key: group.key },
          h('button', {
            className: 'dsh-school-group-head',
            type: 'button',
            onClick: () => setOpenGroup(open ? null : group.key),
          },
            h('span', { className: 'dsh-school-chevron' + (open ? ' is-open' : '') }, '▸'),
            h('span', { className: 'dsh-school-group-name' }, group.label),
            h('span', { className: 'dsh-school-group-count' }, group.courses.length + ' 门'),
          ),
          open ? h('div', { className: 'dsh-school-group-body' }, group.courses.map(renderCourse)) : null,
        );
      };

      const renderSchedule = () => {
        if (events.status === 'idle' || events.status === 'loading') {
          return h('div', { className: 'dsh-school-hint' }, '正在读取日程…');
        }
        if (events.status === 'failed') {
          return h('div', null,
            h('div', { className: 'dsh-school-error', style: { marginBottom: '12px' } }, events.error || '读取日程失败'),
            h('button', { className: 'dsh-school-btn', type: 'button', onClick: loadEvents }, '重试'),
          );
        }
        const list = events.list;
        if (list.length === 0) return h('div', { className: 'dsh-school-empty' }, '未来两个月没有日程');
        const days = [];
        let current = null;
        for (const event of list) {
          const key = dayKey(event.timesort);
          if (current === null || current.key !== key) {
            current = { key: key, events: [] };
            days.push(current);
          }
          current.events.push(event);
        }
        return days.map((day) => h('div', { className: 'dsh-school-day', key: day.key },
          h('div', { className: 'dsh-school-day-head' }, formatDayLabel(day.key)),
          day.events.map((event, index) => h('div', { className: 'dsh-school-event', key: String(event.id) + '-' + index },
            h('span', { className: 'dsh-school-event-time' }, formatTime(event.timesort)),
            h('div', { className: 'dsh-school-event-body' },
              h('div', { className: 'dsh-school-event-name' },
                h('span', { className: 'dsh-school-cat tone-muted' }, EVENT_KINDS[event.kind] || '事件'),
                ' ',
                event.name || '未命名事件',
              ),
              event.course ? h('div', { className: 'dsh-school-event-meta' }, event.course) : null,
            ),
            event.kind === 'manual'
              ? h('button', {
                  className: 'dsh-school-event-del',
                  type: 'button',
                  title: '删除这个事件',
                  onClick: () => saveManual(manualEvents.filter((item) => item.id !== event.id)),
                }, '×')
              : h('button', {
                  className: 'dsh-school-event-ignore',
                  type: 'button',
                  title: '不再显示这个事件',
                  onClick: () => ignoreEvent(event),
                }, '忽略'),
          )),
        ));
      };

      const header = h('div', { className: 'dsh-school-header' },
        h('div', { className: 'dsh-school-heading' },
          h('div', { className: 'dsh-school-title' }, '学校'),
          h('div', { className: 'dsh-school-sub' }, '厦门大学马来西亚分校 · Moodle'),
        ),
        h('div', { className: 'dsh-school-spacer' }),
        profile && profile.fullname ? h('div', { className: 'dsh-school-user' }, profile.fullname) : null,
        profile ? h('button', { className: 'dsh-school-btn', type: 'button', onClick: logout, disabled: busy }, '退出') : null,
      );

      const tabBar = phase === 'ready'
        ? h('div', { className: 'dsh-school-tabs' },
            [
              { id: 'courses', label: '课程' },
              { id: 'schedule', label: '日程' },
              { id: 'settings', label: '设置' },
            ].map((entry) => h('button', {
              key: entry.id,
              className: 'dsh-school-tab' + (tab === entry.id ? ' is-active' : ''),
              type: 'button',
              onClick: () => setTab(entry.id),
            }, entry.label)),
          )
        : null;

      let body = null;
      if (phase === 'loading') {
        body = h('div', { className: 'dsh-school-hint' }, '正在读取登录状态…');
      } else if (phase === 'login') {
        body = h('div', { className: 'dsh-school-login' },
          h('form', { className: 'dsh-school-card', onSubmit: submit },
            h('div', { className: 'dsh-school-card-title' }, '登录 Moodle'),
            h('div', { className: 'dsh-school-hint' },
              '使用学校发的 Campus ID 与密码。密码只在本机换一次访问令牌，换完即丢弃，不会保存，也不会出现在对话里。'),
            h('label', { className: 'dsh-school-field' },
              h('span', null, 'Campus ID'),
              h('input', {
                className: 'dsh-school-input',
                type: 'text',
                autoComplete: 'username',
                spellCheck: false,
                value: form.username,
                disabled: busy,
                onChange: (event) => setForm(Object.assign({}, form, { username: event.target.value })),
              }),
            ),
            h('label', { className: 'dsh-school-field' },
              h('span', null, '密码'),
              h('input', {
                className: 'dsh-school-input',
                type: 'password',
                autoComplete: 'current-password',
                value: form.password,
                disabled: busy,
                onChange: (event) => setForm(Object.assign({}, form, { password: event.target.value })),
              }),
            ),
            error ? h('div', { className: 'dsh-school-error' }, error) : null,
            h('button', { className: 'dsh-school-btn dsh-school-btn-primary', type: 'submit', disabled: busy },
              busy ? '登录中…' : '登录'),
          ),
        );
      } else if (phase === 'error') {
        body = h('div', null,
          h('div', { className: 'dsh-school-error', style: { marginBottom: '12px' } }, error || '出错了'),
          h('button', { className: 'dsh-school-btn', type: 'button', onClick: bootstrap }, '重试'),
        );
      } else if (tab === 'schedule') {
        body = h('div', null,
          h('div', { className: 'dsh-school-toolbar' },
            h('span', { className: 'dsh-school-sub' }, '未来两个月'),
            h('div', { className: 'dsh-school-spacer' }),
            events.fetchedAt
              ? h('span', { className: 'dsh-school-sub' }, '数据截至 ' + formatClock(events.fetchedAt))
              : null,
            h('button', {
              className: 'dsh-school-btn',
              type: 'button',
              onClick: () => loadEvents(true),
              disabled: events.status === 'loading',
            }, '刷新'),
          ),
          h('div', { className: 'dsh-school-addevent' },
            h('input', {
              className: 'dsh-school-input',
              type: 'text',
              placeholder: '事件名称，如 数学期中',
              value: draft.name,
              onChange: (event) => setDraft(Object.assign({}, draft, { name: event.target.value })),
            }),
            h('input', {
              className: 'dsh-school-input',
              type: 'datetime-local',
              value: draft.when,
              onChange: (event) => setDraft(Object.assign({}, draft, { when: event.target.value })),
            }),
            h('select', {
              className: 'dsh-school-input',
              value: draft.course,
              onChange: (event) => setDraft(Object.assign({}, draft, { course: event.target.value })),
            },
              h('option', { value: '' }, '不关联课程'),
              courses.map((course) => h('option', { key: course.id, value: course.fullname }, course.fullname)),
            ),
            h('button', {
              className: 'dsh-school-btn dsh-school-btn-primary',
              type: 'button',
              onClick: addManual,
              disabled: draft.name.trim() === '' || draft.when === '',
            }, '添加'),
          ),
          renderSchedule(),
        );
      } else if (tab === 'settings') {
        body = h('div', null,
          h('div', { className: 'dsh-school-setting' },
            h('div', { className: 'dsh-school-setting-label' }, '下载目录'),
            h('div', { className: 'dsh-school-setting-path' }, settingsDir || '读取中…'),
            h('div', { className: 'dsh-school-hint' },
              '文件按 学期 / 课程 / 类型 分好层放在这里。目录不存在会自动创建。'),
            h('div', { className: 'dsh-school-setting-actions' },
              h('button', {
                className: 'dsh-school-btn',
                type: 'button',
                onClick: pickDirectory,
                disabled: settingsBusy,
              }, settingsBusy ? '请稍候…' : '选择目录'),
              h('button', {
                className: 'dsh-school-btn',
                type: 'button',
                onClick: () => applyDirectory(''),
                disabled: settingsBusy,
              }, '恢复默认'),
              h('button', {
                className: 'dsh-school-btn',
                type: 'button',
                onClick: () => reveal(settingsDir, 'folder'),
                disabled: settingsBusy || settingsDir === '',
              }, '打开'),
            ),
            h('div', { className: 'dsh-school-setting-manual' },
              h('input', {
                className: 'dsh-school-input',
                type: 'text',
                spellCheck: false,
                value: settingsInput,
                disabled: settingsBusy,
                placeholder: 'C:\\Users\\你\\Documents\\课件',
                onChange: (event) => setSettingsInput(event.target.value),
              }),
              h('button', {
                className: 'dsh-school-btn dsh-school-btn-primary',
                type: 'button',
                onClick: () => applyDirectory(settingsInput.trim()),
                disabled: settingsBusy,
              }, '保存'),
            ),
            h('div', { className: 'dsh-school-hint' }, '手动填写时必须是完整绝对路径。'),
          ),
          h('div', { className: 'dsh-school-setting' },
            h('div', { className: 'dsh-school-setting-label' }, '已忽略的日程'),
            h('div', { className: 'dsh-school-hint' }, '目前隐藏了 ' + ignoredIds.length + ' 条自动识别的事件。'),
            h('div', { className: 'dsh-school-setting-actions' },
              h('button', {
                className: 'dsh-school-btn',
                type: 'button',
                onClick: () => saveIgnored([]),
                disabled: settingsBusy || ignoredIds.length === 0,
              }, '全部恢复'),
            ),
          ),
        );
      } else {
        body = h('div', null,
          h('div', { className: 'dsh-school-toolbar' },
            h('span', { className: 'dsh-school-sub' }, courses.length + ' 门课程 · ' + groups.length + ' 个学期'),
            h('div', { className: 'dsh-school-spacer' }),
            h('button', {
              className: 'dsh-school-btn',
              type: 'button',
              onClick: () => reveal(downloadDir, 'folder'),
            }, '下载目录'),
            h('button', { className: 'dsh-school-btn', type: 'button', onClick: refreshCourses, disabled: busy }, '刷新'),
          ),
          error ? h('div', { className: 'dsh-school-error', style: { marginBottom: '10px' } }, error) : null,
          courses.length === 0
            ? h('div', { className: 'dsh-school-empty' }, '没有查询到课程')
            : groups.map(renderGroup),
        );
      }

      const noticeBar = notice !== ''
        ? h('div', { className: 'dsh-school-notice' }, notice)
        : null;

      const downloadBar = lastDownload && lastDownload.items.length > 0
        ? h('div', { className: 'dsh-school-dlbar' },
            h('span', null, '已保存 ' + lastDownload.items.length + ' 个文件'),
            h('span', { className: 'dsh-school-dlbar-path', title: lastDownload.root }, lastDownload.root),
            lastDownload.items.length === 1
              ? h('button', {
                  className: 'dsh-school-btn dsh-school-btn-sm',
                  type: 'button',
                  onClick: () => reveal(lastDownload.items[0].fullPath, 'open'),
                }, '打开文件')
              : null,
            h('button', {
              className: 'dsh-school-btn dsh-school-btn-sm',
              type: 'button',
              onClick: () => reveal(lastDownload.items[0].fullPath, 'folder'),
            }, '打开文件夹'),
          )
        : null;

      const selectionBar = selectedItems.length > 0
        ? h('div', { className: 'dsh-school-selbar' },
            h('span', null, '已选 ' + selectedItems.length + ' 个文件'),
            h('div', { className: 'dsh-school-spacer' }),
            h('button', {
              className: 'dsh-school-btn',
              type: 'button',
              onClick: () => setSelection({}),
              disabled: downloading !== null,
            }, '清空'),
            h('button', {
              className: 'dsh-school-btn dsh-school-btn-primary',
              type: 'button',
              onClick: () => runDownload(selectedItems),
              disabled: downloading !== null,
            }, downloading ? '下载中…' : '下载'),
          )
        : null;

      return h('div', { className: 'dsh-school' },
        h('style', { key: 'style' }, CSS),
        header,
        tabBar,
        noticeBar,
        downloadBar,
        h('div', { className: 'dsh-school-body' }, body),
        selectionBar,
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: 'school',
          order: 30,
          label: '学校',
        }, SchoolIcon));
        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: 'school',
        }, SchoolPanel));
      },
    };
  },
});
