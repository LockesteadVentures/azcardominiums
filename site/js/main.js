/* AZ Cardominiums: tour form and mobile bar. No dependencies. */

/* ==========================================================================
   CONFIG: where the tour form posts.
   '/api/tour' is the Vercel function in /api/tour.js that emails the lead
   through Resend. Any service that accepts a urlencoded POST and returns
   JSON (Formspree, Basin, etc) also works here.
   Leave it empty to fall back to a prefilled email to AzCardominiums@gmail.com.
   ========================================================================== */
const FORM_ENDPOINT = '/api/tour';

const CONTACT_EMAIL = 'AzCardominiums@gmail.com';

(function () {
  'use strict';

  /* ---------- Tour form ---------- */
  const form = document.getElementById('tour-form');
  const success = document.getElementById('form-success');
  if (form && success) {
    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const fields = {
      name: form.elements.name,
      phone: form.elements.phone,
      email: form.elements.email,
    };

    const checks = {
      name: (v) => v.trim().length > 0,
      phone: (v) => v.replace(/\D/g, '').length >= 10,
      email: (v) => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    };

    function setError(key, show) {
      const input = fields[key];
      const msg = document.getElementById('e-' + key);
      input.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (msg) msg.hidden = !show;
    }

    function validate() {
      let firstBad = null;
      Object.keys(checks).forEach((key) => {
        const ok = checks[key](fields[key].value);
        setError(key, !ok);
        if (!ok && !firstBad) firstBad = fields[key];
      });
      return firstBad;
    }

    // Clear an error as soon as the field becomes valid.
    Object.keys(fields).forEach((key) => {
      fields[key].addEventListener('input', () => {
        if (fields[key].getAttribute('aria-invalid') === 'true' && checks[key](fields[key].value)) setError(key, false);
      });
      fields[key].addEventListener('blur', () => {
        if (fields[key].value !== '') setError(key, !checks[key](fields[key].value));
      });
    });

    function showSuccess(viaEmail) {
      form.hidden = true;
      success.hidden = false;
      success.querySelector('.success-fallback').hidden = !viaEmail;
      success.focus();
    }

    function buildMailto(data) {
      const lines = [
        'Name: ' + data.get('name'),
        'Phone: ' + data.get('phone'),
        'Email: ' + (data.get('email') || ''),
        'Interested in: ' + (data.get('interested_in') || ''),
        '',
        String(data.get('message') || ''),
      ];
      return 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent('Tour request from ' + data.get('name')) +
        '&body=' + encodeURIComponent(lines.join('\n'));
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';

      const firstBad = validate();
      if (firstBad) {
        firstBad.focus();
        return;
      }

      const data = new FormData(form);

      // Honeypot: bots fill hidden fields. Pretend it worked and send nothing.
      if (String(data.get('company') || '').trim() !== '') {
        showSuccess(false);
        return;
      }
      data.delete('company');

      if (!FORM_ENDPOINT) {
        window.location.href = buildMailto(data);
        showSuccess(true);
        return;
      }

      submitBtn.disabled = true;
      const label = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: new URLSearchParams(data),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showSuccess(false);
      } catch (err) {
        status.textContent = 'Something went wrong sending your request. Please call 520-247-6644 or email ' + CONTACT_EMAIL + '.';
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      }
    });
  }

  /* ---------- Mobile bar: hide while the form is on screen ---------- */
  const bar = document.querySelector('.mobile-bar');
  const tour = document.getElementById('tour');
  if (bar && tour && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => bar.classList.toggle('is-hidden', entry.isIntersecting));
    }, { rootMargin: '0px 0px -30% 0px' }).observe(tour);
  }
})();
