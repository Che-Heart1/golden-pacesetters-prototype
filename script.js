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

// 4 — Nav anchor offset (intercept clicks, account for sticky nav height)
(function () {
  var nav = document.getElementById('topnav');

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var offset = nav ? nav.getBoundingClientRect().height : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}());

// 5 — Active nav link highlighting (IntersectionObserver on sections)
(function () {
  if (!('IntersectionObserver' in window)) return;
  var navLinks = document.querySelectorAll('.topnav__link');

  function setActive(id) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace(/^.*#/, '');
      if (href === id) {
        link.classList.add('topnav__link--active');
      } else {
        link.classList.remove('topnav__link--active');
      }
    });
  }

  var nav = document.getElementById('topnav');
  var navH = nav ? nav.getBoundingClientRect().height : 80;

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    rootMargin: '-' + navH + 'px 0px -60% 0px',
    threshold: 0
  });

  ['mission', 'skills', 'values', 'projects', 'contact'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
}());

// 6 — Topnav scroll state
(function () {
  var nav = document.getElementById('topnav');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());

// 7 — Hamburger mobile menu
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

// 8 — Contact form validation + AJAX submit
(function () {
  var form = document.getElementById('contact-form');
  var msg  = document.getElementById('contact-msg');
  if (!form) return;

  function getField(id)  { return document.getElementById('field-' + id); }
  function getError(id)  { return document.getElementById('error-' + id); }

  function showError(id, text) {
    var field = getField(id);
    var err   = getError(id);
    if (!field || !err) return;
    field.classList.add('contact__field--invalid');
    err.textContent = text;
    err.classList.add('contact__error--visible');
  }

  function clearError(id) {
    var field = getField(id);
    var err   = getError(id);
    if (!field || !err) return;
    field.classList.remove('contact__field--invalid');
    err.classList.remove('contact__error--visible');
    err.textContent = '';
  }

  function validate() {
    var valid = true;
    var name    = (getField('name')    || {}).value || '';
    var email   = (getField('email')   || {}).value || '';
    var phone   = (getField('phone')   || {}).value || '';
    var message = (getField('message') || {}).value || '';

    if (name.trim().length < 2) {
      showError('name', 'Please enter your full name (at least 2 characters).');
      valid = false;
    } else {
      clearError('name');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('email');
    }

    var digits = phone.replace(/\D/g, '');
    if (digits.length < 7) {
      showError('phone', 'Please enter a valid phone number (at least 7 digits).');
      valid = false;
    } else {
      clearError('phone');
    }

    if (message.trim().length < 10) {
      showError('message', 'Please tell us a bit more (at least 10 characters).');
      valid = false;
    } else {
      clearError('message');
    }

    return valid;
  }

  // Clear error on input
  ['name', 'email', 'phone', 'message'].forEach(function (id) {
    var field = getField(id);
    if (field) {
      field.addEventListener('input', function () { clearError(id); });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

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

// 9 — Scroll-to-top button
(function () {
  var btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('scroll-top--visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());
