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
        } else if (href !== '/' && currentPath.includes(href)) {
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
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(normalizedQuery) || answer.includes(normalizedQuery)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Contact Form Validation (for contact page)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
        });
    }
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
        background-color: ${type === 'success' ? 'var(--primary)' : 'var(--destructive)'};
        color: white;
        box-shadow: var(--shadow-lg);
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

