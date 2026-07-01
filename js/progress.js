(function () {
  'use strict';

  var STORAGE_KEY = 'java-tutorial-visited';

  /* ── 获取当前页面的唯一标识键 ── */
  function getPageKey() {
    var path = window.location.pathname;
    /* 提取文件名部分，如 pages/basics.html 或 index.html */
    var match = path.match(/\/([^/]+\.html)$/);
    if (match) return match[1];
    if (path.endsWith('/') || path.endsWith('/java-learning') || path.endsWith('/java-learning')) return 'index.html';
    return 'index.html';
  }

  /* ── 记录当前页面到 localStorage（首页不计入章节数）── */
  function recordVisit() {
    var key = getPageKey();
    if (!key || key === 'index.html') return;
    try {
      var visited = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (visited.indexOf(key) === -1) {
        visited.push(key);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
      }
    } catch (e) {}
  }

  /* ── 获取已访问的页面集合 ── */
  function getVisited() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  /* ── 获取所有章节链接的 href 列表 ── */
  function getChapterLinks() {
    var links = [];
    document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      /* 提取文件名 */
      var match = href && href.match(/([^/]+\.html)$/);
      if (match) links.push(match[1]);
    });
    return links;
  }

  /* ── 在首页顶部渲染进度条 ── */
  function renderHomeProgress() {
    var main = document.querySelector('.main');
    if (!main) return;

    /* 只在首页渲染 */
    var pageKey = getPageKey();
    if (pageKey !== 'index.html') return;

    var visited = getVisited();
    var total = 17;
    var completed = visited.length;
    var pct = Math.min(100, Math.round((completed / total) * 100));

    var progressBar = document.createElement('div');
    progressBar.className = 'study-progress';

    progressBar.innerHTML =
      '<div class="study-progress-header">' +
        '<span class="study-progress-label">📖 学习进度</span>' +
        '<span class="study-progress-count">已完成 <strong>' + completed + '</strong>/' + total + ' 章节</span>' +
      '</div>' +
      '<div class="study-progress-track">' +
        '<div class="study-progress-fill" style="width:' + pct + '%"></div>' +
      '</div>';

    var firstH1 = main.querySelector('h1');
    if (firstH1) {
      firstH1.parentNode.insertBefore(progressBar, firstH1.nextSibling);
    } else {
      main.insertBefore(progressBar, main.firstChild);
    }
  }

  /* ── 在侧边栏中标记已访问的链接 ── */
  function markSidebar() {
    var visited = getVisited();
    document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      var match = href && href.match(/([^/]+\.html)$/);
      if (!match) return;

      if (visited.indexOf(match[1]) !== -1) {
        /* 避免重复添加 */
        if (!a.querySelector('.visit-mark')) {
          var mark = document.createElement('span');
          mark.className = 'visit-mark';
          mark.textContent = ' ✅';
          a.appendChild(mark);
        }
      }
    });
  }

  /* ── 初始化 ── */
  function init() {
    recordVisit();

    /* 等待其他 JS 完成 DOM 操作（如 enhanceCodeBlocks 等） */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        renderHomeProgress();
        markSidebar();
      });
    } else {
      renderHomeProgress();
      markSidebar();
    }
  }

  init();
})();
