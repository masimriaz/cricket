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
      numPlayers: { min: 9, max: 10, msg: 'Players must be between 9 and 10' }
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

    // Terms checkbox validation
    var terms = document.getElementById('acceptTerms');
    if (terms) {
      terms.addEventListener('change', function () {
        if (terms.checked) {
          terms.classList.remove('is-invalid');
        }
      });
    }

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

      // Check terms checkbox
      var terms = document.getElementById('acceptTerms');
      if (terms && !terms.checked) {
        allValid = false;
        terms.classList.add('is-invalid');
      }

      if (!allValid) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Submit via Formspree AJAX
      var formData = new FormData(form);
      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.reset();
          form.querySelectorAll('.is-valid, .is-invalid').forEach(function (el) {
            el.classList.remove('is-valid', 'is-invalid');
          });
          var modal = new bootstrap.Modal(document.getElementById('successModal'));
          modal.show();
        } else {
          alert('Something went wrong. Please try again or email us directly.');
        }
      }).catch(function () {
        alert('Network error. Please check your connection and try again.');
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Submit Registration';
      });
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

  // === Save Brochure as HD JPEG Image ===
  var saveBtn = document.getElementById('saveBrochure');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      var brochure = document.querySelector('[data-brochure="printable"]');
      if (!brochure || typeof html2canvas === 'undefined') return;
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Generating HD Image...';
      html2canvas(brochure, { scale: 4, useCORS: true, backgroundColor: '#ffffff', logging: false }).then(function (canvas) {
        var link = document.createElement('a');
        link.download = 'Freedom-Cup-2026-Brochure-HD.jpeg';
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
      }).catch(function () {
        alert('Could not generate image. Please try again.');
      }).finally(function () {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="bi bi-download me-2"></i>Save HD Image';
      });
    });
  }

})();
