/* Estação do Agente • SuperAção SP — interações (sem dependências) */
(function () {
  'use strict';

  var norm = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  };

  /* ------------------------------------------------ carrossel da jornada */
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var cards = Array.prototype.slice.call(car.querySelectorAll('.stage-card'));
    var dotsWrap = car.closest('.container').querySelector('[data-carousel-dots]');
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];
    if (!cards.length) return;

    var step = function () {
      return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : car.clientWidth;
    };
    var current = function () {
      var max = car.scrollWidth - car.clientWidth;
      if (car.scrollLeft >= max - 4) return cards.length - 1;
      return Math.round(car.scrollLeft / step());
    };
    var target = null;
    var setDot = function (i) {
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === i);
        d.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
    };
    var paint = function () {
      if (target !== null) return; // durante a rolagem animada mantém o ponto de destino
      setDot(current());
    };
    var settle;
    var go = function (i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      target = i;
      setDot(i);
      car.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
      clearTimeout(settle);
      settle = setTimeout(function () { target = null; }, 700);
    };

    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    car.addEventListener('scroll', paint, { passive: true });
    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
    });

    // arrastar com o mouse ("Passe para o lado")
    var down = false, moved = false, startX = 0, startLeft = 0;
    car.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = car.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; car.classList.add('is-dragging'); }
      if (moved) car.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      if (moved) {
        car.classList.remove('is-dragging');
        var delta = car.scrollLeft - startLeft;
        var base = Math.round(startLeft / step());
        go(Math.abs(delta) > 60 ? base + (delta > 0 ? 1 : -1) : base);
      }
    });
    car.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    paint();
  });

  /* ------------------------------------------------ filtros (políticas / tutoriais / biblioteca) */
  document.querySelectorAll('[data-filter]').forEach(function (panel) {
    var scope = panel.parentElement;
    var list = scope.querySelector('[data-filter-list]');
    var empty = scope.querySelector('[data-filter-empty]');
    var input = panel.querySelector('[data-filter-search]');
    var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-chip]'));
    var items = list ? Array.prototype.slice.call(list.children) : [];
    var state = { cat: 'todos', mod: '', q: '' };

    var apply = function () {
      var q = norm(state.q);
      var shown = 0;
      items.forEach(function (el) {
        var okCat = state.cat === 'todos' || el.getAttribute('data-cat') === state.cat;
        var okMod = !state.mod || el.getAttribute('data-mod') === state.mod;
        var okQ = !q || (el.getAttribute('data-search') || '').indexOf(q) !== -1;
        var ok = okCat && okMod && okQ;
        el.hidden = !ok;
        if (ok) shown++;
      });
      chips.forEach(function (c) {
        var on = c.getAttribute('data-filter-chip') === state.cat && !state.mod;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (empty) empty.hidden = shown !== 0;
    };

    var fromHash = function () {
      var h = decodeURIComponent((location.hash || '').slice(1));
      state.mod = '';
      if (h.indexOf('mod-') === 0) { state.cat = 'todos'; state.mod = h.slice(4); }
      else if (h && chips.some(function (c) { return c.getAttribute('data-filter-chip') === h; })) state.cat = h;
      else state.cat = 'todos';
      apply();
    };

    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        state.cat = c.getAttribute('data-filter-chip');
        state.mod = '';
        var hash = state.cat === 'todos' ? '' : '#' + state.cat;
        history.replaceState(null, '', location.pathname + location.search + hash);
        apply();
      });
    });
    if (input) input.addEventListener('input', function () { state.q = input.value; apply(); });
    window.addEventListener('hashchange', fromHash);
    fromHash();
  });

  /* ------------------------------------------------ popups (passos, módulos, legenda) */
  var lastFocus = null;
  // volta o popup para a primeira aba (Como fazer / primeira categoria)
  var resetTabs = function (m) {
    m.querySelectorAll('[role="tablist"]').forEach(function (list) {
      var first = list.querySelector('[data-tab]');
      if (first) selectTab(first);
    });
  };
  var openModal = function (id) {
    var m = document.getElementById(id);
    if (!m) return;
    // Anterior / Próximo e os botões dos módulos trocam um popup pelo outro
    var current = document.querySelector('.modal:not([hidden])');
    if (current && current !== m) current.hidden = true;
    else if (!current) lastFocus = document.activeElement;
    resetTabs(m);
    m.hidden = false;
    var box = m.querySelector('.modal__box');
    if (box) box.scrollTop = 0;
    document.body.classList.add('modal-open');
    var f = m.querySelector('.modal__close');
    if (f) f.focus({ preventScroll: true });
  };
  var closeModal = function (m) {
    m.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  };
  var selectTab = function (t) {
    var list = t.closest('[role="tablist"]');
    var box = t.closest('.modal__box');
    if (!list || !box) return;
    list.querySelectorAll('[data-tab]').forEach(function (x) {
      x.classList.toggle('is-active', x === t);
      x.setAttribute('aria-selected', x === t ? 'true' : 'false');
    });
    box.querySelectorAll('[data-tab-panel]').forEach(function (p) {
      p.hidden = p.getAttribute('data-tab-panel') !== t.getAttribute('data-tab');
    });
  };
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) { e.preventDefault(); openModal(opener.getAttribute('data-modal-open')); return; }
    var closer = e.target.closest('[data-modal-close]');
    if (closer) { closeModal(closer.closest('.modal')); return; }
    var tab = e.target.closest('[role="tablist"] [data-tab]');
    if (tab && tab.getAttribute('aria-disabled') !== 'true') selectTab(tab);
  });
  document.addEventListener('keydown', function (e) {
    var m = document.querySelector('.modal:not([hidden])');
    if (!m) return;
    if (e.key === 'Escape') { closeModal(m); return; }
    // setas trocam de aba quando o foco está numa aba
    var tab = document.activeElement && document.activeElement.closest && document.activeElement.closest('[role="tablist"] [data-tab]');
    if (tab && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) {
      var tabs = Array.prototype.slice.call(tab.closest('[role="tablist"]').querySelectorAll('[data-tab]'));
      var d = /Right|Down/.test(e.key) ? 1 : -1;
      var next = tabs[(tabs.indexOf(tab) + d + tabs.length) % tabs.length];
      e.preventDefault();
      next.focus();
      selectTab(next);
    }
  });

  /* ------------------------------------------------ links ainda sem destino no protótipo */
  document.querySelectorAll('a[data-external], a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.getAttribute('href') === '#') e.preventDefault();
    });
  });

  /* ------------------------------------------------ busca do cabeçalho */
  var INDEX = window.SEARCH_INDEX || [];
  document.querySelectorAll('[data-site-search]').forEach(function (form) {
    var input = form.querySelector('input');
    var box = form.querySelector('.search__results');
    var focus = -1;
    var results = [];

    var render = function () {
      var q = norm(input.value);
      if (q.length < 2) { box.hidden = true; return; }
      var terms = q.split(/\s+/);
      results = INDEX.filter(function (it) {
        var hay = it.k;
        return terms.every(function (t) { return hay.indexOf(t) !== -1; });
      }).slice(0, 8);
      focus = -1;
      box.innerHTML = results.length
        ? results.map(function (r) { return '<li><a href="' + r.h + '">' + r.t + '<small>' + r.s + '</small></a></li>'; }).join('')
        : '<li class="none">Nenhum resultado para “' + input.value.replace(/</g, '&lt;') + '”.</li>';
      box.hidden = false;
    };
    var move = function (d) {
      var links = box.querySelectorAll('a');
      if (!links.length) return;
      focus = (focus + d + links.length) % links.length;
      links.forEach(function (l, i) { l.classList.toggle('is-focus', i === focus); });
    };

    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      if (e.key === 'Escape') { box.hidden = true; }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var pick = results[focus >= 0 ? focus : 0];
      if (pick) location.href = pick.h;
    });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) box.hidden = true; });
  });
})();
