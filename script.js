// =============================
// DARK MODE TOGGLE ✅ FIXED
// =============================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    updateThemeButton(themeToggle);

    // Toggle on click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');

            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            updateThemeButton(themeToggle);
        });
    }
}

// Button text updater
function updateThemeButton(btn) {
    if (!btn) return;
    if (document.documentElement.classList.contains('dark')) {
        btn.textContent = ' Light Mode';
    } else {
        btn.textContent = 'Dark Mode';
    }
}

// =============================
// MOBILE MENU TOGGLE
// =============================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (!mobileMenuToggle || !mobileNav) return;

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active', isOpen);
    });

    // Close menu on link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// =============================
// ACTIVE NAV HIGHLIGHT
// =============================
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

// =============================
// SMOOTH SCROLL
// =============================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

// =============================
// FAQ ACCORDION
// =============================
function initFAQAccordion() {
    document.querySelectorAll(".faq-item").forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        question.addEventListener("click", () => {
            const isOpen = item.classList.toggle("active");
            answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : "0";
        });
    });
}

// =============================
// SEARCH
// =============================
function initSearch() {
    document.querySelectorAll('input[type="search"]').forEach(input => {
        input.addEventListener("keypress", e => {
            if (e.key !== "Enter") return;

            e.preventDefault();
            const query = input.value.trim();
            if (!query) return;

            window.location.href = `/faq.html?search=${encodeURIComponent(query)}`;
        });
    });

    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search");

    if (searchQuery && location.pathname.includes("faq")) {
        const searchInput = document.querySelector(".faq-search input");
        if (searchInput) {
            searchInput.value = searchQuery;
            filterFAQ(searchQuery);
        }
    }
}

function filterFAQ(query) {
    const q = query.toLowerCase();
    document.querySelectorAll(".faq-item").forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? "block" : "none";
    });
}

// =============================
// CONTACT FORM VALIDATION
// =============================
function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const name = form.querySelector("#name").value.trim();
        const email = form.querySelector("#email").value.trim();
        const message = form.querySelector("#message").value.trim();

        if (!name || !email || !message) {
            showNotification("Please fill in all fields", "error");
            return;
        }

        if (!isValidEmail(email)) {
            showNotification("Invalid email address", "error");
            return;
        }

        showNotification("✅ Message sent successfully!", "success");
        form.reset();
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =============================
// NOTIFICATION SYSTEM
// =============================
function showNotification(message, type = "info") {
    document.querySelector(".notification")?.remove();

    const note = document.createElement("div");
    note.textContent = message;

    note.className = "notification";
    note.style.cssText = `
        position: fixed;
        z-index: 9999;
        top: 4rem;
        right: 1rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        background-color: ${type === "success" ? "var(--primary)" : "#dc2626"};
        color: white;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(note);

    setTimeout(() => {
        note.style.animation = "slideOut 0.3s ease-out";
        setTimeout(() => note.remove(), 300);
    }, 4000);
}

// =============================
// SCROLL ANIMATIONS
// =============================
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        ".category-card,.testimonial-card,.blog-card,.feature-item"
    ).forEach(el => observer.observe(el));
}

// =============================
// LOAD EVERYTHING
// =============================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    updateActiveNavLink();
    initSmoothScroll();
    initFAQAccordion();
    initSearch();
    initContactForm();
    initScrollAnimations();
});

window.addEventListener("popstate", updateActiveNavLink);
