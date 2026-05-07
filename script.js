/* ==========================================================================
   David's Auto Repairs — Site Interactions
   ========================================================================== */

(function () {
    'use strict';

    // -----------------------------
    // Preloader
    // -----------------------------
    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        if (!preloader) return;
        setTimeout(function () { preloader.classList.add('hidden'); }, 500);
    });

    // -----------------------------
    // Sticky nav shadow on scroll
    // -----------------------------
    var navbar = document.getElementById('navbar');
    function handleNavScroll() {
        if (!navbar) return;
        if (window.scrollY > 10) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // -----------------------------
    // Mobile nav toggle
    // -----------------------------
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });
        // Close on link tap
        navMenu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // -----------------------------
    // Active nav link on scroll
    // -----------------------------
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-menu .nav-link');
    function setActiveLink() {
        var pos = window.scrollY + 120;
        sections.forEach(function (sec) {
            var top = sec.offsetTop;
            var bottom = top + sec.offsetHeight;
            var id = sec.getAttribute('id');
            if (pos >= top && pos < bottom) {
                navLinks.forEach(function (l) {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    window.addEventListener('scroll', setActiveLink, { passive: true });

    // -----------------------------
    // IntersectionObserver — fade animations
    // -----------------------------
    var animated = document.querySelectorAll('[data-animate]');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    var delay = e.target.getAttribute('data-delay') || 0;
                    setTimeout(function () { e.target.classList.add('in-view'); }, parseInt(delay, 10));
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        animated.forEach(function (el) { io.observe(el); });
    } else {
        animated.forEach(function (el) { el.classList.add('in-view'); });
    }

    // -----------------------------
    // Hero stat counters
    // -----------------------------
    var counters = document.querySelectorAll('[data-count]');
    function animateCount(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        var start = 0;
        var duration = 1600;
        var startTime = null;
        function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(start + (target - start) * eased);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    animateCount(e.target);
                    counterObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { counterObserver.observe(el); });
    }

    // -----------------------------
    // Footer year
    // -----------------------------
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // -----------------------------
    // "Sent" toast (after FormSubmit redirect)
    // -----------------------------
    if (window.location.search.indexOf('sent=1') !== -1) {
        var toast = document.createElement('div');
        toast.textContent = '✓ Thanks! David will be in touch shortly.';
        toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);background:#1A3FBF;color:#fff;padding:14px 24px;border-radius:8px;font-weight:600;box-shadow:0 12px 40px rgba(26,63,191,0.4);z-index:9999;font-family:Inter,sans-serif;';
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.style.transition = 'opacity .5s';
            toast.style.opacity = '0';
            setTimeout(function () { toast.remove(); }, 600);
        }, 5000);
    }
})();
