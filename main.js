// NexCore Laptop Service - Main JavaScript File
// Handles interactions, animations, and functionality

// ============================================
// DOM Ready and Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Hide loader after content loads
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
    }, 2000);

    // Initialize event listeners
    setupNavigation();
    setupCounters();
    setupScrollAnimations();
    setupFormHandling();
    setupFAQToggle();
    setupSmoothScroll();
}

// ============================================
// Navigation
// ============================================

function setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Menu toggle
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Hide navbar on scroll down, show on scroll up
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// ============================================
// Scroll Animations with Intersection Observer
// ============================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation class to elements
    const animElements = document.querySelectorAll(
        '.service-card, .feature, .review-card, .brand-item'
    );

    animElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.3s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add CSS animation rule
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// Animated Counters
// ============================================

function setupCounters() {
    const counterElements = document.querySelectorAll('[data-count]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);

    counterElements.forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// Form Handling
// ============================================

function setupFormHandling() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const data = {
        name: e.target.elements[0].value,
        email: e.target.elements[1].value,
        phone: e.target.elements[2].value,
        service: e.target.elements[3].value,
        message: e.target.elements[4].value
    };

    // Validate form
    if (!validateForm(data)) {
        showNotification('Please fill all fields correctly', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // In production, you would send data to server here
        console.log('Form data:', data);

        // Show success notification
        showNotification('Message sent successfully! We will contact you soon.', 'success');

        // Reset form
        e.target.reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Optional: Redirect after success
        setTimeout(() => {
            // window.location.href = '/thank-you';
        }, 1500);
    }, 1500);
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!data.name || data.name.trim().length < 2) {
        return false;
    }

    if (!data.email || !emailRegex.test(data.email)) {
        return false;
    }

    if (data.phone && !phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        return false;
    }

    if (!data.service) {
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        return false;
    }

    return true;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Add animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
    }
}

// ============================================
// FAQ Toggle
// ============================================

function setupFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

function toggleFAQ(button) {
    const item = button.closest('.faq-item');
    if (!item) return;

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(faq => {
        if (faq !== item && faq.classList.contains('active')) {
            faq.classList.remove('active');
        }
    });

    item.classList.toggle('active');
}

// ============================================
// Smooth Scroll
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// Performance Optimizations
// ============================================

// Lazy load images (if using img tags)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// Analytics and Tracking
// ============================================

// Track button clicks
function trackEvent(eventName, eventData = {}) {
    // Send to analytics service
    console.log(`Event: ${eventName}`, eventData);

    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Track CTA clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary')) {
        trackEvent('CTA_Click', {
            buttonText: e.target.textContent
        });
    }
});

// Track form submissions
document.addEventListener('submit', (e) => {
    if (e.target.id === 'contactForm') {
        trackEvent('Form_Submit', {
            formName: 'contact'
        });
    }
});

// ============================================
// Service Worker Registration
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// ============================================
// Dark Mode Toggle (Optional)
// ============================================

function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
}

// Call dark mode initialization
initDarkMode();

// ============================================
// Mobile Optimization
// ============================================

// Prevent bounce scroll on mobile
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.nav-menu')) {
        return;
    }
}, false);

// Handle device orientation changes
window.addEventListener('orientationchange', () => {
    // Adjust layout if needed
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
});

// ============================================
// Keyboard Navigation
// ============================================

document.addEventListener('keydown', (e) => {
    // Close menu on Escape
    if (e.key === 'Escape') {
        document.getElementById('navMenu').classList.remove('active');
        document.getElementById('menuToggle').classList.remove('active');
    }

    // Navigate sections with arrow keys
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        const sections = document.querySelectorAll('section');
        const current = Array.from(sections).findIndex(
            s => s.getBoundingClientRect().top >= 0
        );
        if (current < sections.length - 1) {
            sections[current + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ============================================
// Export functions for global access
// ============================================

window.toggleFAQ = toggleFAQ;
window.handleFormSubmit = handleFormSubmit;

// ============================================
// Console Welcome Message
// ============================================

console.log('%cWelcome to NexCore Laptop Service!', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%cFor support, visit: https://nexcore-laptop-repair.com', 'color: #1a7fd0; font-size: 12px;');
console.log('%cOr call: +91-9415-444-888', 'color: #1a7fd0; font-size: 12px;');
