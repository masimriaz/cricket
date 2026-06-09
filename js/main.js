/* ============================================================
   Freedom Cup 2026 - Main JavaScript
   Vanilla JS only, no dependencies beyond Bootstrap 5
   ============================================================ */

(function () {
  'use strict';

  // === Navbar Scroll Effect ===
  var navbar = document.getElementById('mainNav');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // === Back to Top Button ===
  var backBtn = document.createElement('button');
  backBtn.className = 'back-to-top';
  backBtn.setAttribute('aria-label', 'Back to top');
  backBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(backBtn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === Scroll Reveal ===
  var revealElements = document.querySelectorAll('.card-hover, .award-card, .invitation-letter, .brochure-section');
  function checkReveal() {
    var trigger = window.innerHeight * 0.88;
    revealElements.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add('reveal', 'visible');
      }
    });
  }
  window.addEventListener('scroll', checkReveal);
  checkReveal();

  // === Form Validation ===
  var form = document.querySelector('[data-form="registration"]');
  if (form) {
    var fields = {
      teamName: { min: 2, msg: 'Team name must be at least 2 characters' },
      captainName: { min: 2, msg: 'Captain name is required' },
      captainEmail: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Enter a valid email address' },
      captainPhone: { min: 7, msg: 'Enter a valid phone number' },
      numPlayers: { min: 9, max: 11, msg: 'Players must be between 9 and 11' }
    };

    function validateField(input, rules) {
      var val = input.value.trim();
      var valid = true;

      if (rules.pattern) {
        valid = rules.pattern.test(val);
      } else if (rules.min !== undefined && rules.max !== undefined) {
        var num = parseInt(val, 10);
        valid = !isNaN(num) && num >= rules.min && num <= rules.max;
      } else if (rules.min !== undefined) {
        valid = val.length >= rules.min;
      }

      // Update UI
      var feedback = input.parentElement.querySelector('.invalid-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentElement.appendChild(feedback);
      }

      if (valid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        feedback.textContent = '';
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        feedback.textContent = rules.msg;
        feedback.style.display = 'block';
      }
      return valid;
    }

    // Real-time validation on blur
    Object.keys(fields).forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener('blur', function () {
          validateField(input, fields[id]);
        });
        input.addEventListener('input', function () {
          if (input.classList.contains('is-invalid')) {
            validateField(input, fields[id]);
          }
        });
      }
    });

    // Submit validation
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      Object.keys(fields).forEach(function (id) {
        var input = document.getElementById(id);
        if (input && !validateField(input, fields[id])) {
          allValid = false;
        }
      });

      if (!allValid) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Collect form data
      var data = {
        teamName: document.getElementById('teamName').value.trim(),
        captainName: document.getElementById('captainName').value.trim(),
        captainEmail: document.getElementById('captainEmail').value.trim(),
        captainPhone: document.getElementById('captainPhone').value.trim(),
        numPlayers: document.getElementById('numPlayers').value.trim(),
        message: document.getElementById('message').value.trim(),
        submittedAt: new Date().toISOString()
      };

      // Save to CSV (append to localStorage and trigger download)
      var csvHeader = 'Team Name,Captain Name,Email,Phone,Players,Message,Submitted At\n';
      var csvRow = [
        '"' + data.teamName.replace(/"/g, '""') + '"',
        '"' + data.captainName.replace(/"/g, '""') + '"',
        data.captainEmail,
        data.captainPhone,
        data.numPlayers,
        '"' + data.message.replace(/"/g, '""') + '"',
        data.submittedAt
      ].join(',') + '\n';

      // Store in localStorage for persistence
      var existing = localStorage.getItem('nhtcl_registrations') || '';
      localStorage.setItem('nhtcl_registrations', existing + csvRow);

      // Trigger CSV download
      var allRows = localStorage.getItem('nhtcl_registrations') || '';
      var blob = new Blob([csvHeader + allRows], { type: 'text/csv' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'nhtcl_registrations.csv';
      a.click();
      URL.revokeObjectURL(url);

      // Reset form
      form.reset();
      form.querySelectorAll('.is-valid, .is-invalid').forEach(function (el) {
        el.classList.remove('is-valid', 'is-invalid');
      });

      // Show success modal
      var modal = new bootstrap.Modal(document.getElementById('successModal'));
      modal.show();
    });
  }

  // === Lightbox for Gallery ===
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Close lightbox">&times;</button><img src="" alt="Gallery image">';
  document.body.appendChild(overlay);

  var lbImg = overlay.querySelector('img');
  var lbClose = overlay.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      if (img && img.src) {
        lbImg.src = img.src;
        lbImg.alt = img.alt || 'Gallery photo';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target === lbClose) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeLightbox();
  });

  // === Smooth Scroll for Anchor Links (Enhancement) ===
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
        // Update URL without jumping
        history.pushState(null, '', this.getAttribute('href'));
      }
    });
  });

  // === Print Helpers ===
  document.querySelectorAll('[onclick*="window.print"]').forEach(function (btn) {
    btn.removeAttribute('onclick');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.print();
    });
  });

  // === Animate Numbers on Scroll (Countdown Enhancement) ===
  var countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    var nums = countdownEl.querySelectorAll('.count-num');
    nums.forEach(function (num) {
      num.style.transition = 'transform 0.3s ease';
    });
  }

})();
