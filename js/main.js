(function () {
  'use strict';

  /* ── Dark Mode ── */
  function initTheme() {
    var saved = localStorage.getItem('java-tutorial-theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  function toggleTheme() {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('java-tutorial-theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('java-tutorial-theme', 'dark');
    }
  }

  function addThemeToggle() {
    var logo = document.querySelector('.sidebar-logo');
    if (!logo) return;
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.innerHTML = '&#9790;';
    btn.setAttribute('aria-label', '切换暗色模式');
    btn.setAttribute('title', '切换暗色模式');
    logo.appendChild(btn);
    btn.addEventListener('click', toggleTheme);
  }

  /* ── Search ── */
  var searchData = [];

  function buildSearchIndex() {
    var main = document.querySelector('.main');
    if (!main) return;
    var pageTitle = document.querySelector('title');
    var title = pageTitle ? pageTitle.textContent.replace(' — Java 入门教程', '') : '';
    var path = window.location.pathname;
    var pageKey = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    var headings = main.querySelectorAll('h1, h2, h3');
    headings.forEach(function (h) {
      var text = h.textContent.replace(/[🔤🔀🏗️⚠️📐📦📅🌊⚡🔧📈🏭☕🍃🗄️🌐🧪📋🚀🏠]/g, '').trim();
      if (!text) return;
      searchData.push({
        title: title,
        section: text,
        url: pageKey + '#' + (h.id || ''),
        keywords: text.toLowerCase()
      });
    });

    var codeBlocks = main.querySelectorAll('pre');
    codeBlocks.forEach(function (pre) {
      var code = pre.textContent || '';
      var words = code.replace(/[<>(){}[\]/\\|;:.=+*\-]/g, ' ').split(/\s+/).filter(function (w) {
        return w.length > 3 && /[a-zA-Z]/.test(w);
      });
      var unique = {};
      words.forEach(function (w) { unique[w.toLowerCase()] = true; });
      var codeKeywords = Object.keys(unique).slice(0, 20).join(' ');
      searchData.push({
        title: title,
        section: '代码示例',
        url: pageKey,
        keywords: codeKeywords
      });
    });
  }

  function initSearch() {
    var sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;

    var searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.innerHTML = '<span class="search-icon">&#128269;</span><input type="text" placeholder="搜索知识点..." id="search-input" autocomplete="off">';
    sidebar.parentNode.insertBefore(searchBox, sidebar);

    var results = document.createElement('div');
    results.className = 'search-results';
    results.id = 'search-results';
    document.body.appendChild(results);

    var input = document.getElementById('search-input');

    function positionResults() {
      var rect = input.getBoundingClientRect();
      results.style.left = rect.left + 'px';
      results.style.top = (rect.bottom + 4) + 'px';
    }

    buildSearchIndex();

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        results.classList.remove('open');
        results.innerHTML = '';
        return;
      }

      positionResults();

      var matches = [];
      searchData.forEach(function (item) {
        if (item.keywords.indexOf(q) !== -1) {
          matches.push(item);
        }
      });

      if (matches.length === 0) {
        results.innerHTML = '<div class="no-results">未找到相关结果</div>';
        results.classList.add('open');
        return;
      }

      var html = '';
      matches.slice(0, 12).forEach(function (m) {
        var sectionHighlight = m.section.replace(new RegExp(q, 'gi'), function (match) {
          return '<span class="search-highlight">' + match + '</span>';
        });
        html += '<a href="' + m.url + '">' + sectionHighlight + '<span class="search-path"> - ' + m.title + '</span></a>';
      });
      results.innerHTML = html;
      results.classList.add('open');
    });

    window.addEventListener('resize', function () {
      if (results.classList.contains('open')) {
        positionResults();
      }
    });

    window.addEventListener('scroll', function () {
      if (results.classList.contains('open')) {
        positionResults();
      }
    }, { passive: true });

    results.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link) {
        results.classList.remove('open');
        input.value = '';
      }
    });

    document.addEventListener('click', function (e) {
      if (!searchBox.contains(e.target) && !results.contains(e.target)) {
        results.classList.remove('open');
        input.value = '';
      }
    });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
      }
    });
  }

  /* ── Reading Progress Bar ── */
  function initProgressBar() {
    var bar = document.createElement('div');
    bar.id = 'progress-bar';
    document.body.prepend(bar);
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    });
  }

  /* ── Back to Top ── */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '&#8593;';
    btn.setAttribute('aria-label', '回到顶部');
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Code Block Enhancements ── */
  function enhanceCodeBlocks() {
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.closest('.code-block')) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      var header = document.createElement('div');
      header.className = 'code-header';

      var langLabel = document.createElement('span');
      langLabel.className = 'lang-label';
      var codeContent = pre.textContent || '';
      var lang = detectLanguage(codeContent);
      langLabel.textContent = lang;

      var copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = '&#128203; 复制';
      copyBtn.setAttribute('aria-label', '复制代码');

      copyBtn.addEventListener('click', function () {
        var text = pre.textContent || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            showCopied(copyBtn);
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand('copy');
            showCopied(copyBtn);
          } catch (e) {}
          document.body.removeChild(ta);
        }
      });

      header.appendChild(langLabel);
      header.appendChild(copyBtn);
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      /* add line numbers for multi-line code blocks */
      var html = pre.innerHTML;
      var lines = html.split('\n');
      /* remove trailing empty line from final \n */
      if (lines.length > 1 && lines[lines.length - 1].trim() === '') {
        lines.pop();
      }
      if (lines.length > 1) {
        wrapper.classList.add('has-line-numbers');
        pre.innerHTML = lines.map(function (line) {
          return '<span class="line">' + line + '</span>';
        }).join('\n');
      }
    });
  }

  function detectLanguage(code) {
    if (/@SpringBootTest|@Service|@RestController|@Entity|@Repository/.test(code)) return 'Java / Spring';
    if (/public\s+(class|interface|enum|abstract)/.test(code)) return 'Java';
    if (/<\?xml/.test(code)) return 'XML';
    if (/^\s*#/.test(code) || /^(server|spring|management|logging)/m.test(code)) return 'YAML / Properties';
    return 'Java';
  }

  function showCopied(btn) {
    btn.innerHTML = '&#10003; 已复制';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.innerHTML = '&#128203; 复制';
      btn.classList.remove('copied');
    }, 2000);
  }

  /* ── Mobile Sidebar ── */
  function initMobileSidebar() {
    var sidebar = document.querySelector('.sidebar');
    var logoArea = document.querySelector('.sidebar-logo');
    if (!sidebar || !logoArea) return;

    var toggle = document.createElement('button');
    toggle.id = 'sidebar-toggle';
    toggle.innerHTML = '&#9776;';
    toggle.setAttribute('aria-label', '切换菜单');
    logoArea.appendChild(toggle);

    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });

    overlay.addEventListener('click', closeSidebar);

    document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
      link.addEventListener('click', closeSidebar);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeSidebar();
    });
  }

  /* ── Table Wrapper ── */
  function wrapTables() {
    document.querySelectorAll('.main table').forEach(function (table) {
      if (table.parentNode.classList.contains('table-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  /* ── Table of Contents ── */
  function initToc() {
    var main = document.querySelector('.main');
    if (!main) return;

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/java-learning' || window.location.pathname.endsWith('/java-learning/')) return;

    var headings = main.querySelectorAll('h2, h3');
    if (headings.length < 3) return;

    var toc = document.createElement('nav');
    toc.className = 'toc-sidebar';

    var header = document.createElement('div');
    header.className = 'toc-header';
    header.textContent = '本页目录';
    toc.appendChild(header);

    var list = document.createElement('ul');
    list.className = 'toc-list';

    var items = [];
    headings.forEach(function (h, i) {
      var id = 'section-' + i;
      h.id = id;

      var tag = h.tagName.toLowerCase();
      var text = h.textContent.replace(/[🔤🔀🏗️⚠️📐📦📅🌊⚡🔧📈🏭☕🍃🗄️🌐🧪📋🚀🏠]/g, '').trim();

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = text;
      if (tag === 'h3') a.className = 'toc-h3';
      li.appendChild(a);
      list.appendChild(li);
      items.push({ el: a, id: id });
    });

    toc.appendChild(list);
    document.body.appendChild(toc);

    setTimeout(function () {
      toc.classList.add('visible');
    }, 50);

    var tocLinks = items;
    var headingEls = headings;

    function updateActive() {
      var scrollY = window.scrollY;
      var activeIndex = 0;

      for (var i = 0; i < headingEls.length; i++) {
        var el = headingEls[i];
        if (el.offsetTop - 100 <= scrollY) {
          activeIndex = i;
        }
      }

      tocLinks.forEach(function (item, idx) {
        if (idx === activeIndex) {
          item.el.classList.add('active');
        } else {
          item.el.classList.remove('active');
        }
      });

      var activeEl = tocLinks[activeIndex].el;
      var tocRect = toc.getBoundingClientRect();
      var activeRect = activeEl.getBoundingClientRect();
      if (activeRect.bottom > tocRect.bottom || activeRect.top < tocRect.top) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initProgressBar();
    initBackToTop();
    enhanceCodeBlocks();
    initMobileSidebar();
    addThemeToggle();
    initSearch();
    wrapTables();
    initToc();
  });
})();