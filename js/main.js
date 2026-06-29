(function () {
  'use strict';

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

    /* skip on homepage — page itself is a navigation */
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
      var text = h.textContent.replace(/[🔤🔀🏗️⚠️📐📦📅🌊⚡🔧📈🏭☕🍃🗄️🌐🧪📋🚀]/g, '').trim();

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

    /* scrollspy */
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

      /* keep active TOC item visible in sidebar */
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
    initProgressBar();
    initBackToTop();
    enhanceCodeBlocks();
    initMobileSidebar();
    wrapTables();
    initToc();
  });
})();
