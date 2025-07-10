// Enhanced script.js with modern effects and interactivity

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll) with better settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: true,
            offset: 100,
            delay: 100
        });
    }
    
    // Navbar functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const backToTopBtn = document.getElementById('backToTop');

    // Hamburger menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            // Toggle active class on hamburger
            this.classList.toggle('active');
            
            // Toggle open class on nav links
            navLinks.classList.toggle('open');
            
            // Add fade class to nav links with delay for staggered animation
            const navItems = navLinks.querySelectorAll('li');
            navItems.forEach((item, index) => {
                // Reset animation
                item.classList.remove('fade');
                
                // Add fade class with delay
                if (navLinks.classList.contains('open')) {
                    setTimeout(() => {
                        item.classList.add('fade');
                    }, index * 100);
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('open') && 
                !event.target.closest('.nav-links') && 
                !event.target.closest('.hamburger')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            }
        });
        
        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // Add active class to current nav item
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split("/").pop();
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
               (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveNavItem();
    
    // Header scroll effect - adds smaller header on scroll
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run once on page load
    
    // Back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add tilt effect to service boxes
    const serviceBoxes = document.querySelectorAll('.service-box');
    
    serviceBoxes.forEach(box => {
        box.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            
            const icon = this.querySelector('i');
            if (icon) icon.style.transform = 'scale(1.1)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            
            const icon = this.querySelector('i');
            if (icon) icon.style.transform = 'scale(1)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .service-button, .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Add parallax effect to hero section
    const heroSection = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroSection && heroContent) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < heroSection.offsetHeight) {
                heroContent.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            }
        });
    }
    
    // Enhanced hover effects for features and process sections
    const featureBoxes = document.querySelectorAll('.feature-box');
    featureBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.querySelectorAll('i, h3').forEach(el => {
                el.style.transform = 'scale(1.1)';
                el.style.transition = 'transform 0.3s ease';
            });
        });
        
        box.addEventListener('mouseleave', function() {
            this.querySelectorAll('i, h3').forEach(el => {
                el.style.transform = 'scale(1)';
            });
        });
    });
    
    // Dynamic typing effect for hero heading
    function typeWriter() {
        const heroTitle = document.querySelector('.typing-effect');
        if (!heroTitle) return;
        
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        heroTitle.style.visibility = 'visible';
        
        let i = 0;
        const speed = 50; // typing speed
        
        function type() {
            if (i < text.length) {
                // Handle HTML tags for spans or other elements
                if (text.charAt(i) === '<') {
                    // Find closing bracket
                    const closeIndex = text.indexOf('>', i);
                    if (closeIndex !== -1) {
                        heroTitle.innerHTML += text.substring(i, closeIndex + 1);
                        i = closeIndex + 1;
                    }
                } else {
                    heroTitle.innerHTML += text.charAt(i);
                    i++;
                }
                setTimeout(type, speed);
            }
        }
        
        setTimeout(() => {
            type();
        }, 500);
    }
    
    // Run typing effect only on homepage
    if (window.location.pathname === '/' || window.location.pathname.includes('index')) {
        typeWriter();
    }
    
    // Lazy load images for better performance
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
        });
    }
    
    // Animated counter for statistics
    const counterItems = document.querySelectorAll('.counter-value');
    
    if (counterItems.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'), 10);
                    let count = 0;
                    const interval = setInterval(() => {
                        count += Math.ceil(target / 25);
                        if (count >= target) {
                            counter.textContent = target + (counter.textContent.includes('%') ? '%' : '+');
                            clearInterval(interval);
                        } else {
                            counter.textContent = count + (counter.textContent.includes('%') ? '%' : '+');
                        }
                    }, 50);
                    
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counterItems.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // Add floating animations to decorative elements
    const addFloatingAnimation = () => {
        const shapes = document.querySelectorAll('.hero-shapes .shape');
        if (shapes.length) {
            shapes.forEach((shape, index) => {
                shape.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
                shape.style.animationDelay = `${index * 0.5}s`;
            });
        }
    };
    
    addFloatingAnimation();
    
    // Enhanced scroll animations
    const scrollElements = document.querySelectorAll('.fade-in-scroll');
    
    const elementInView = (el, scrollOffset = 100) => {
        const elementRect = el.getBoundingClientRect();
        return (
            elementRect.top <= (window.innerHeight || document.documentElement.clientHeight) - scrollOffset
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Run once on page load
});