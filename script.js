// 1 — Hero entrance
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hero.classList.add('hero--ready');
    });
  });
}());

// 2 — Scroll fade-in (IntersectionObserver)
(function () {
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Section header blocks (Offer / Values / Projects all use .offer__header)
  document.querySelectorAll('.offer__header').forEach(function (el) {
    el.classList.add('anim-fade-up');
    observer.observe(el);
  });

  // Mission & Vision rows: text slides in from left, image from right
  document.querySelectorAll('.mv__row').forEach(function (row) {
    var text = row.querySelector('.mv__text');
    var card = row.querySelector('.mv__card');
    if (text) { text.classList.add('anim-fade-left');  observer.observe(text); }
    if (card) { card.classList.add('anim-fade-right'); observer.observe(card); }
  });

  // Service cards — staggered 100 ms apart
  document.querySelectorAll('.offer__card').forEach(function (el, i) {
    el.classList.add('anim-fade-up');
    el.style.animationDelay = (i * 100) + 'ms';
    observer.observe(el);
  });

  // Value cards — staggered 100 ms apart
  document.querySelectorAll('.values__card').forEach(function (el, i) {
    el.classList.add('anim-fade-up');
    el.style.animationDelay = (i * 100) + 'ms';
    observer.observe(el);
  });

  // Project cards — staggered 100 ms apart
  document.querySelectorAll('.proj__card').forEach(function (el, i) {
    el.classList.add('anim-fade-up');
    el.style.animationDelay = (i * 100) + 'ms';
    observer.observe(el);
  });

  // Contact card
  document.querySelectorAll('.contact__card').forEach(function (el) {
    el.classList.add('anim-fade-up');
    observer.observe(el);
  });
}());

// 3 — Parallax hero background (desktop only)
(function () {
  if (window.innerWidth <= 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var bg = document.querySelector('.hero__bg');
  if (!bg) return;
  window.addEventListener('scroll', function () {
    bg.style.transform = 'translateY(' + (window.scrollY * 0.4) + 'px)';
  }, { passive: true });
}());

// 4 — Topnav scroll state
(function () {
  var nav = document.getElementById('topnav');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());

(function () {
  var btn  = document.getElementById('nav-hamburger');
  var menu = document.getElementById('nav-mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    btn.textContent = isOpen ? '✕' : '☰';
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      btn.textContent = '☰';
    });
  });
}());

(function () {
  var form = document.getElementById('contact-form');
  var msg  = document.getElementById('contact-msg');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('.contact__submit');

    btn.disabled    = true;
    btn.textContent = 'Sending…';
    msg.textContent = '';
    msg.className   = 'contact__msg';

    fetch('https://formspree.io/f/REPLACE_WITH_YOUR_ID', /* REPLACE WITH FORMSPREE ENDPOINT */ {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          msg.textContent = 'Message sent! We\'ll be in touch soon.';
          msg.className   = 'contact__msg contact__msg--success';
          form.reset();
        } else {
          return res.json().then(function (data) {
            var errors = data.errors
              ? data.errors.map(function (err) { return err.message; }).join(', ')
              : 'Something went wrong. Please try again.';
            throw new Error(errors);
          });
        }
      })
      .catch(function (err) {
        msg.textContent = err.message || 'Something went wrong. Please try again.';
        msg.className   = 'contact__msg contact__msg--error';
      })
      .finally(function () {
        btn.disabled    = false;
        btn.textContent = 'Initiate Contact';
      });
  });
}());
