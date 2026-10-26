(function () {
  'use strict';

  var EMAIL = 'globaladventure.eu@gmail.com';

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Partner button preselects the partnership topic
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  document.querySelectorAll('[data-subject]').forEach(function (el) {
    el.addEventListener('click', function () {
      form.elements.topic.value = el.getAttribute('data-subject');
    });
  });

  // Contact form: validate, then open the visitor's email app with a prefilled message
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var valid = true;
    ['name', 'email', 'message'].forEach(function (key) {
      var ok = f[key].value.trim() !== '' && (key !== 'email' || /^\S+@\S+\.\S+$/.test(f[key].value));
      f[key].setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok) valid = false;
    });
    note.className = 'form-note';
    if (!valid) {
      note.classList.add('error');
      note.textContent = 'Please fill in your name, a valid email and your message.';
      return;
    }
    var subject = 'Enquiry: ' + f.topic.value;
    var body = 'Name: ' + f.name.value + '\nEmail: ' + f.email.value + '\n\n' + f.message.value;
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app. If nothing opens, write to ' + EMAIL + '.';
  });

  // Scroll animations: each block fades in as it enters the screen
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');

    var groups = [
      ['.section > .wrap > h2, .section > .wrap > .intro, #process > .wrap > .btn', ''],
      ['.service', ''],
      ['.partners > div', 'from-left'],
      ['.partner-types li', 'from-right'],
      ['.approach > div', ''],
      ['.steps li', ''],
      ['.about > h2', 'from-left'],
      ['.about > div', 'from-right'],
      ['.contact-grid > div', 'from-left'],
      ['.contact-grid > form', 'from-right']
    ];

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('in');
        io.unobserve(el);
        // Clean up after the entrance so hover effects respond instantly
        setTimeout(function () { el.classList.remove('reveal', 'in'); }, 1800);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    groups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        el.classList.add('reveal');
        if (g[1]) el.classList.add(g[1]);
        // Stagger siblings that appear together (cap at 4 steps)
        el.style.setProperty('--i', Math.min(i, 4));
        io.observe(el);
      });
    });
  }

  // Headline: animate word by word
  if (document.documentElement.classList.contains('js')) {
    var h1 = document.querySelector('.hero h1');
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', h1.textContent.trim());
    h1.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'word';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--w', i);
      span.textContent = w;
      h1.appendChild(span);
      if (i < words.length - 1) h1.appendChild(document.createTextNode(' '));
    });
  }

  // Scroll effects: progress bar, header shadow, hero parallax, active menu link
  var header = document.querySelector('.site-header');
  var progress = document.getElementById('progress');
  var ring = document.querySelector('.ring');
  var heroInner = document.querySelector('.hero-inner');
  var spy = [].slice.call(document.querySelectorAll('.nav a[href^="#"]:not(.btn)')).map(function (a) {
    return { a: a, s: document.querySelector(a.getAttribute('href')) };
  }).filter(function (x) { return x.s; });
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', y > 20);
    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (!reduce && y < window.innerHeight * 1.2) {
      ring.style.setProperty('--ry', (y * 0.18) + 'px');
      heroInner.style.setProperty('--py', (y * -0.12) + 'px');
    }
    var current = null;
    spy.forEach(function (x) {
      if (x.s.getBoundingClientRect().top <= window.innerHeight * 0.35) current = x;
    });
    spy.forEach(function (x) { x.a.classList.toggle('active', x === current); });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Shake the form when validation fails
  form.addEventListener('submit', function () {
    if (form.querySelector('[aria-invalid="true"]')) {
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
    }
  });
})();
