// FORZAR DESBLOQUEO MAESTRO DEL SCROLL POR SI ACASO (Anti-candado)
document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
document.documentElement.style.setProperty('height', 'auto', 'important');
document.body.style.setProperty('overflow-y', 'auto', 'important');
document.body.style.setProperty('height', 'auto', 'important');

document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const preloader = document.getElementById('preloader');
    const enterBtn = document.getElementById('enter-btn');
    const loaderCounter = document.getElementById('loader-counter');
    const loadingTextFill = document.getElementById('loading-text-fill');
    const loaderStatus = document.getElementById('loader-status'); 

    // 1. BYPASS DEL PRELOADER (Si el usuario ya entró antes)
    if (sessionStorage.getItem('zazkee_visited')) {
        if (preloader) preloader.style.display = 'none';
        
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
                        // Asegurar el desbloqueo al terminar
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

    // 3. MENÚ MÓVIL (Lógica Oculta/Visible con Touch Outside)
    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(menuBtn && mobileMenu) {
        const icon = menuBtn.querySelector('i');
        
        // Alternar al tocar el botón
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isClosed = mobileMenu.classList.toggle('hidden');
            if (icon) {
                icon.classList.toggle('fa-bars', isClosed);
                icon.classList.toggle('fa-xmark', !isClosed);
            }
        });

        // Cerrar si se toca afuera del menú
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });
    }

    // 4. SCROLL SUAVE Y TRANSICIONES ENTRE PÁGINAS
    document.querySelectorAll('a.nav-link, a.mobile-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.includes('#')) {
                // Si es un ancla a otra página (ej. index.html#about), dejamos que el navegador lo maneje normal
                if (targetId.includes('.html#')) return;

                e.preventDefault();
                if (targetId === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                // Cerrar menú móvil al seleccionar opción
                if(mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = menuBtn ? menuBtn.querySelector('i') : null;
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-xmark');
                    }
                }
            } else if (targetId && targetId.includes('.html')) {
                // Transición fade hacia otra página
                e.preventDefault();
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '0';
                setTimeout(() => { window.location.href = targetId; }, 500);
            }
        });
    });

    // 5. ANIMACIONES AL SCROLL (.reveal)
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

   // 6. LÓGICA DE MODO LUZ Y OSCURO (Optimizada para carga inicial móvil)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    
    const bgVideo = document.getElementById('bg-video');
    const videoOverlay = document.getElementById('video-overlay');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('zazkee_theme') || 'dark';

    function applyTheme(theme, isInitialLoad = false) {
        const isLight = theme === 'light';
        const targetSrc = isLight ? 'videoLuz.mp4' : 'videoNo.mp4';
        const targetPoster = isLight ? 'poster-luz.jpg' : 'poster-noche.jpg';

        // 1. Cambiar clases y colores
        if (isLight) {
            htmlEl.classList.remove('dark');
            if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
            if (themeIconMobile) { themeIconMobile.classList.remove('fa-moon'); themeIconMobile.classList.add('fa-sun'); }
            if (videoOverlay) {
                videoOverlay.classList.remove('bg-black/60', 'bg-black/50');
                videoOverlay.classList.add('bg-white/60'); 
            }
            localStorage.setItem('zazkee_theme', 'light');
        } else {
            htmlEl.classList.add('dark');
            if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
            if (themeIconMobile) { themeIconMobile.classList.remove('fa-sun'); themeIconMobile.classList.add('fa-moon'); }
            if (videoOverlay) {
                videoOverlay.classList.remove('bg-white/60');
                videoOverlay.classList.add('bg-black/60'); 
            }
            localStorage.setItem('zazkee_theme', 'dark');
        }

        // 2. Lógica del Video: Evitar reiniciar la descarga inicial
        if (bgVideo) {
            // Solo modificamos el 'src' si es distinto al que ya está cargando el HTML
            if (!bgVideo.src.includes(targetSrc)) {
                if (isInitialLoad) {
                    bgVideo.poster = targetPoster;
                    bgVideo.src = targetSrc;
                    bgVideo.style.opacity = '0.9';
                } else {
                    bgVideo.style.opacity = '0';
                    setTimeout(() => {
                        bgVideo.poster = targetPoster;
                        bgVideo.src = targetSrc;
                        bgVideo.play().catch(e => console.log("Autoplay bloqueado", e));
                        bgVideo.style.opacity = '0.9';
                    }, 300);
                }
            } else {
                // Si ya es el correcto, solo lo hacemos visible
                bgVideo.style.opacity = '0.9';
            }
        }
    }

    // Pasamos "true" para indicarle a la función que es la carga inicial de la página
    applyTheme(savedTheme, true);

    function toggleTheme() {
        const currentTheme = htmlEl.classList.contains('dark') ? 'dark' : 'light';
        // Pasamos "false" porque esto es una acción manual del usuario
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark', false);
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);