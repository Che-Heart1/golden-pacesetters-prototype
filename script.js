(function () {
  var nav = document.getElementById('topnav');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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
