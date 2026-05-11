(function () {
  'use strict';

  /* Scroll Reveal */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  /* Header: add 'scrolled' class after page scrolls  */
  const header = document.getElementById('header');

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Drag to Scroll Carousel */
  const carousel = document.getElementById('carousel');
  if (carousel) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let dragVelocity = 0;
    let lastX = 0;
    let momentumFrame = null;

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    /* Pointer down begin drag */
    carousel.addEventListener('pointerdown', (e) => {
      // Ignore if clicking inside an iframe
      if (e.target.tagName === 'IFRAME') return;

      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      lastX = e.pageX;
      dragVelocity = 0;

      carousel.classList.add('is-dragging');
      carousel.setPointerCapture(e.pointerId);

      if (momentumFrame) {
        cancelAnimationFrame(momentumFrame);
        momentumFrame = null;
      }
    });

    /* Pointer move  drag scroll */
    carousel.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.15; // slight multiplier for feel
      carousel.scrollLeft = scrollLeft - walk;

      dragVelocity = e.pageX - lastX;
      lastX = e.pageX;
    });

    /* Release momentum scroll */
    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove('is-dragging');

      // Momentum: decelerate naturally
      let velocity = dragVelocity * 0.8;

      const momentum = () => {
        if (Math.abs(velocity) < 0.5) return;
        carousel.scrollLeft -= velocity;
        velocity *= 0.9;
        momentumFrame = requestAnimationFrame(momentum);
      };
      momentumFrame = requestAnimationFrame(momentum);
    };

    carousel.addEventListener('pointerup', endDrag);
    carousel.addEventListener('pointercancel', endDrag);
    carousel.addEventListener('pointerleave', endDrag);

    /* Prevent clicking iframes during/after drag */
    carousel.addEventListener('click', (e) => {
      if (Math.abs(carousel.scrollLeft - scrollLeft) > 4) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  /* Contact Form Submit */
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (submitBtn && formSuccess) {
    submitBtn.addEventListener('click', () => {
      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        shakeBtn(submitBtn);
        return;
      }

      if (!isValidEmail(email)) {
        shakeBtn(submitBtn);
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.65';
      submitBtn.querySelector('span').textContent = 'Sending…';

      setTimeout(() => {
        submitBtn.style.display = 'none';
        formSuccess.setAttribute('aria-hidden', 'false');
        formSuccess.classList.add('is-visible');

        // Clear form
        ['name', 'email', 'message'].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
      }, 1200);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeBtn(btn) {
    btn.style.animation = 'none';
    btn.offsetHeight; // reflow
    btn.style.animation = 'shake 0.4s ease';
    btn.addEventListener('animationend', () => {
      btn.style.animation = '';
    }, { once: true });
  }

  /* Inject shake keyframes dynamically */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%  { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
      100%{ transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

  /* Smooth section anchors (Nav fallback)  */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();