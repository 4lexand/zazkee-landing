document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
document.documentElement.style.setProperty('height', 'auto', 'important');
document.body.style.setProperty('overflow-y', 'auto', 'important');
document.body.style.setProperty('height', 'auto', 'important');    
    const preloader = document.getElementById('preloader');
    const enterBtn = document.getElementById('enter-btn');
    const loaderCounter = document.getElementById('loader-counter');
    const loadingTextFill = document.getElementById('loading-text-fill');
    const loaderStatus = document.getElementById('loader-status'); 

    // 1. BYPASS DEL PRELOADER (Si el usuario recarga la página)
    if (sessionStorage.getItem('zazkee_visited')) {
        if (preloader) preloader.style.display = 'none';
        
        // GARANTÍA ABSOLUTA PARA DESBLOQUEAR EL SCROLL
        document.body.classList.remove('no-scroll');
        document.body.style.overflow = 'auto'; 

        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => document.body.style.opacity = '1', 50);
        
        if(window.innerWidth >= 1024) { 
            gsap.set('#hero-img', { autoAlpha: 1, x: 0 }); 
        } else { 
            gsap.set('#hero-img', { autoAlpha: 1, y: 0 }); 
        }
        gsap.set('.hero-element', { autoAlpha: 1, y: 0 });
        
    } else {
        // 2. LÓGICA DEL PRELOADER (Primera vez)
        let count = 0;
        const loadingPhrases = [
            "CONNECTING WALLET...", 
            "SECURING JACKPOT...", 
            "VERIFYING CONTRACT...", 
            "SYSTEM READY..."
        ];

        if (loadingTextFill) {
            loadingTextFill.style.transition = 'width 0.1s linear';
        }

        const interval = setInterval(() => {
            count += Math.floor(Math.random() * 3) + 1;
            if (count > 100) count = 100;
            
            if (loaderCounter) loaderCounter.textContent = count;
            
            if (loadingTextFill) {
                loadingTextFill.style.width = count + '%';
            }

            if (loaderStatus) {
                if (count < 25) loaderStatus.textContent = loadingPhrases[0];
                else if (count < 60) loaderStatus.textContent = loadingPhrases[1];
                else if (count < 90) loaderStatus.textContent = loadingPhrases[2];
                else loaderStatus.textContent = loadingPhrases[3];
            }

            if (count === 100) {
                clearInterval(interval);
                if (enterBtn) {
                    enterBtn.classList.remove('pointer-events-none');
                    enterBtn.style.transition = 'all 0.5s ease';
                    enterBtn.style.opacity = '1';
                    enterBtn.style.visibility = 'visible';
                    enterBtn.style.transform = 'translateY(0)';
                }
            }
        }, 30);

        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                sessionStorage.setItem('zazkee_visited', 'true');
                
                const audio = new Audio('sound.mp3'); 
                audio.volume = 0.3;
                audio.play().catch(e => console.log("Audio play failed:", e));

                gsap.to('#preloader', {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut",
                    onComplete: () => {
                        // DESBLOQUEO DE SCROLL
                        document.body.classList.remove('no-scroll');
                        document.body.style.overflow = 'auto';
                        
                        gsap.to('.hero-element', {
                            y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power3.out"
                        });

                        if(window.innerWidth >= 1024) {
                            gsap.to('#hero-img', { x: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });
                        } else {
                            gsap.to('#hero-img', { y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });
                        }
                    }
                });
            });
        }
    }

    // 3. MENÚ MÓVIL
    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(menuBtn && mobileMenu) {
        const icon = menuBtn.querySelector('i');
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    // 4. SCROLL SUAVE Y TRANSICIONES (Navegación)
    document.querySelectorAll('a.nav-link, a.mobile-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                if (targetId === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                if(mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-xmark');
                    }
                }
            } else if (targetId && targetId.includes('.html')) {
                e.preventDefault();
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '0';
                setTimeout(() => { window.location.href = targetId; }, 500);
            }
        });
    });

    // 5. ANIMACIONES AL HACER SCROLL (.reveal)
    const sections = document.querySelectorAll('.reveal');
    if (sections.length > 0) {
        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        sections.forEach(sec => observer.observe(sec));
    }

    // 6. LÓGICA DE MODO LUZ Y OSCURO (Video Backgrounds)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    
    const bgVideo = document.getElementById('bg-video');
    const videoOverlay = document.getElementById('video-overlay');
    const htmlEl = document.documentElement;

    // Lee la preferencia guardada, si no hay asume "dark"
    const savedTheme = localStorage.getItem('zazkee_theme') || 'dark';

    function applyTheme(theme) {
        if (theme === 'light') {
            htmlEl.classList.remove('dark');
            if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
            if (themeIconMobile) { themeIconMobile.classList.remove('fa-moon'); themeIconMobile.classList.add('fa-sun'); }
            
            if (bgVideo) {
                bgVideo.style.opacity = '0';
                setTimeout(() => {
                    bgVideo.src = 'videoLuz.mp4';
                    bgVideo.play().catch(e => console.log("Autoplay bloqueado", e));
                    bgVideo.style.opacity = '0.9';
                }, 300);
            }
            if (videoOverlay) {
                videoOverlay.classList.remove('bg-black/60', 'bg-black/50');
                videoOverlay.classList.add('bg-white/60'); 
            }
            localStorage.setItem('zazkee_theme', 'light');
        } else {
            htmlEl.classList.add('dark');
            if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
            if (themeIconMobile) { themeIconMobile.classList.remove('fa-sun'); themeIconMobile.classList.add('fa-moon'); }
            
            if (bgVideo) {
                bgVideo.style.opacity = '0';
                setTimeout(() => {
                    bgVideo.src = 'videoNo.mp4';
                    bgVideo.play().catch(e => console.log("Autoplay bloqueado", e));
                    bgVideo.style.opacity = '0.9';
                }, 300);
            }
            if (videoOverlay) {
                videoOverlay.classList.remove('bg-white/60');
                videoOverlay.classList.add('bg-black/60'); 
            }
            localStorage.setItem('zazkee_theme', 'dark');
        }
    }

    // Aplica el tema inmediatamente
    applyTheme(savedTheme);

    function toggleTheme() {
        const currentTheme = htmlEl.classList.contains('dark') ? 'dark' : 'light';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
});
