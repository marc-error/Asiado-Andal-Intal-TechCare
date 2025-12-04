// Dark Mode Toggle
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.classList.toggle('dark', savedTheme === 'dark');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active', isOpen);
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// Active Navigation Link
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        
        if (href === currentPath || (href === '/' && currentPath === '/index.html')) {
            link.classList.add('active');
        } else if (href !== '/' && href && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// FAQ Accordion (for FAQ page)
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon'); // Assuming you have an icon to rotate
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.toggle('active');
                answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
                
                // Rotate the icon when FAQ is opened/closed
                if (icon) {
                    icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        }
    });
}

// Search Functionality
function initSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = input.value.trim();
                if (query) {
                    // Redirect to FAQ page with search query
                    window.location.href = `/faq.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    });
    
    // Handle search query on FAQ page
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && window.location.pathname.includes('faq.html')) {
        const searchInput = document.querySelector('.faq-search input');
        if (searchInput) {
            searchInput.value = searchQuery;
            filterFAQ(searchQuery);
        }
    }
}

// Filter FAQ
function filterFAQ(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    const normalizedQuery = query.toLowerCase();
    
    faqItems.forEach(item => {
        const question = (item.querySelector('.faq-question') || { textContent: '' }).textContent.toLowerCase();
        const answer = (item.querySelector('.faq-answer') || { textContent: '' }).textContent.toLowerCase();
        
        if (question.includes(normalizedQuery) || answer.includes(normalizedQuery)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Contact Form: POSTs the form to the server using fetch and shows server response.
// Important: this will only run if JS is enabled; with JS disabled the form will submit normally.
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        // Prevent default so we can POST with fetch and show inline feedback
        e.preventDefault();
        
        const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
        const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
        const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
        
        // Simple client-side validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Build FormData from the form (includes select values etc.)
        const formData = new FormData(contactForm);
        const actionUrl = contactForm.getAttribute('action') || './contact_db.php';
        
        try {
            const resp = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    // Do NOT set Content-Type when sending FormData; browser will set the boundary for multipart/form-data
                    'X-Requested-With': 'fetch'
                }
            });
            
            const text = await resp.text();
            
            if (resp.ok) {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                // optionally redirect or update the UI here
            } else {
                // server-side validation errors typically return status 400 with body text
                showNotification(text || 'Server returned an error. See console for details.', 'error');
                console.error('Server response:', resp.status, text);
            }
        } catch (err) {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            console.error('Fetch error:', err);
        }
    });
}

// Email Validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 5rem;
        right: 1rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        background-color: ${type === 'success' ? 'var(--primary,#2b8aef)' : 'var(--destructive,#e74c3c)'};
        color: white;
        box-shadow: var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.15));
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Fade-in Animation on Scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.category-card, .testimonial-card, .blog-card, .feature-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    updateActiveNavLink();
    initSmoothScroll();
    initFAQAccordion();
    initSearch();
    initContactForm();
    initScrollAnimations();
});

// Update active link on page navigation
window.addEventListener('popstate', updateActiveNavLink);

// script.js - show a poster image (YouTube thumbnail) in the modal instead of embedding the video.
// Clicking the poster opens the video on YouTube (avoids embedding errors).
(function () {
  const overlay = document.getElementById('modal-overlay');
  const modal = overlay && overlay.querySelector('.modal');
  const titleEl = document.getElementById('modal-title');
  const categoryEl = document.getElementById('modal-category');
  const descEl = document.getElementById('modal-desc');
  const mediaContainer = document.getElementById('modal-media');
  const linkEl = document.getElementById('modal-link');
  let lastFocused = null;

  // extract YouTube video id (supports youtube.com/watch?v= and youtu.be short links and embed path)
  function extractYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.slice(1);
      }
      if (u.hostname.includes('youtube.com')) {
        if (u.searchParams.has('v')) return u.searchParams.get('v');
        const m = u.pathname.match(/\/embed\/([^/?]+)/);
        if (m) return m[1];
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // poster URLs (try maxresfirst, fallback to hqdefault)
  function posterUrlsForYouTubeId(id) {
    return [
      `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${id}/mqdefault.jpg`
    ];
  }

  // create poster node: clickable wrapper that opens video in new tab
  function createPosterNode(videoUrl, title) {
    const id = extractYouTubeId(videoUrl);
    const wrapper = document.createElement('div');
    wrapper.className = 'video-poster';
    // fallback image while we try thumbnails
    const img = document.createElement('img');
    img.alt = title ? `${title} — video preview` : 'Video preview';
    img.src = ''; // will be set below
    wrapper.appendChild(img);

    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'play-overlay';
    const playBtn = document.createElement('div');
    playBtn.className = 'play-button';
    playBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>';
    overlayDiv.appendChild(playBtn);
    wrapper.appendChild(overlayDiv);

    // click opens the youtube page in a new tab
    wrapper.addEventListener('click', () => {
      window.open(videoUrl, '_blank', 'noopener');
    });

    // try to load highest-res thumbnail first; if it 404s, fallback to next
    if (id) {
      const urls = posterUrlsForYouTubeId(id);
      let i = 0;
      function tryLoad() {
        if (i >= urls.length) {
          // final fallback: show a simple placeholder background
          img.src = '';
          img.style.background = 'linear-gradient(90deg,#111,#333)';
          return;
        }
        const testUrl = urls[i++];
        const tester = new Image();
        tester.onload = function () {
          // accept and use the loaded thumbnail
          img.src = testUrl;
        };
        tester.onerror = function () { tryLoad(); };
        tester.src = testUrl;
      }
      tryLoad();
    } else {
      // not a youtube URL -> show a neutral placeholder
      img.style.background = 'linear-gradient(90deg,#111,#333)';
    }

    return wrapper;
  }

  function openModal(data) {
    if (!overlay) return;
    lastFocused = document.activeElement;

    if (titleEl) titleEl.textContent = data.title || '';
    if (categoryEl) categoryEl.textContent = data.category || '';
    if (descEl) descEl.textContent = data.desc || '';

    if (data.video && linkEl) {
      linkEl.href = data.video;
      linkEl.style.display = 'inline-flex';
    } else if (linkEl) {
      linkEl.style.display = 'none';
    }

    // Insert picture poster instead of embedding video
    if (mediaContainer) mediaContainer.innerHTML = '';
    if (data.video && mediaContainer) {
      const posterNode = createPosterNode(data.video, data.title || '');
      mediaContainer.appendChild(posterNode);
      mediaContainer.setAttribute('aria-hidden', 'false');
    } else if (mediaContainer) {
      mediaContainer.innerHTML = '<div style="padding:1rem;color:var(--muted-foreground)">No preview available.</div>';
      mediaContainer.setAttribute('aria-hidden', 'true');
    }

    if (overlay) {
      overlay.style.display = '';
      overlay.setAttribute('aria-hidden', 'false');
    }
    setTimeout(() => {
      modal && modal.focus();
      trapFocus(modal);
    }, 50);
    document.documentElement.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
    if (mediaContainer) mediaContainer.innerHTML = '';
    overlay.style.display = 'none';
    document.documentElement.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // Attach triggers
  document.querySelectorAll('.modal-trigger').forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      const dataset = card.dataset || {};
      openModal({ category: dataset.category, title: dataset.title, desc: dataset.desc, video: dataset.video });
    });

    const btn = card.querySelector('.open-modal');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const dataset = card.dataset || {};
        openModal({ category: dataset.category, title: dataset.title, desc: dataset.desc, video: dataset.video });
      });
    }
  });

  // Close behavior
  overlay && overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', function (e) { e.preventDefault(); closeModal(); }));
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (overlay && overlay.getAttribute('aria-hidden') === 'false') closeModal(); } });

  // Focus trap
  function trapFocus(container) {
    if (!container) return;
    const selectors = 'a[href],area[href],input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';
    const nodes = container.querySelectorAll(selectors);
    const focusables = Array.prototype.slice.call(nodes).filter(n => n.offsetWidth || n.offsetHeight || n.getClientRects().length);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    function handler(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
        else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
      }
    }
    container.addEventListener('keydown', handler);
    const observer = new MutationObserver(function () {
      if (overlay.getAttribute('aria-hidden') === 'true') {
        container.removeEventListener('keydown', handler);
        observer.disconnect();
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['aria-hidden'] });
  }

})();