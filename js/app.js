// FORZAR DESBLOQUEO MAESTRO DEL SCROLL
document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
document.documentElement.style.setProperty('height', 'auto', 'important');
document.body.style.setProperty('overflow-y', 'auto', 'important');
document.body.style.setProperty('height', 'auto', 'important');

document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const enterBtn = document.getElementById('enter-btn');
    const bgVideo = document.getElementById('bg-video');
    const videoOverlay = document.getElementById('video-overlay');

    // 1. LÓGICA DE CARGA INTELIGENTE (Detecta si hay preloader)
    if (preloader) {
        if (sessionStorage.getItem('zazkee_visited')) {
            preloader.style.display = 'none';
            document.body.style.opacity = '1';
            if(window.innerWidth >= 1024) { gsap.set('#hero-img', { autoAlpha: 1, x: 0 }); } 
            else { gsap.set('#hero-img', { autoAlpha: 1, y: 0 }); }
            gsap.set('.hero-element', { autoAlpha: 1, y: 0 });
        } else {
            let count = 0;
            const loadingPhrases = ["CONNECTING WALLET...", "SECURING JACKPOT...", "VERIFYING CONTRACT...", "SYSTEM READY..."];
            const fill = document.getElementById('loading-text-fill');
            const status = document.getElementById('loader-status');
            const counter = document.getElementById('loader-counter');

            if(fill) fill.style.transition = 'width 0.1s linear';

            const interval = setInterval(() => {
                count += Math.floor(Math.random() * 3) + 1;
                if (count > 100) count = 100;
                
                if(counter) counter.textContent = count;
                if(fill) fill.style.width = count + '%';
                if(status) {
                    if (count < 25) status.textContent = loadingPhrases[0];
                    else if (count < 60) status.textContent = loadingPhrases[1];
                    else if (count < 90) status.textContent = loadingPhrases[2];
                    else status.textContent = loadingPhrases[3];
                }

                if (count === 100) {
                    clearInterval(interval);
                    if(enterBtn) {
                        enterBtn.classList.remove('pointer-events-none');
                        enterBtn.style.opacity = '1';
                        enterBtn.style.visibility = 'visible';
                    }
                }
            }, 30);

            if(enterBtn) {
                enterBtn.addEventListener('click', () => {
                    sessionStorage.setItem('zazkee_visited', 'true');
                    const audio = new Audio('sound.mp3'); 
                    audio.volume = 0.3; audio.play().catch(()=>{});

                    gsap.to('#preloader', {
                        yPercent: -100, duration: 1, ease: "power4.inOut",
                        onComplete: () => {
                            document.body.style.opacity = '1';
                            gsap.to('.hero-element', { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power3.out" });
                            gsap.to('#hero-img', { 
                                x: window.innerWidth >= 1024 ? 0 : 0, 
                                y: window.innerWidth >= 1024 ? 0 : 0, 
                                autoAlpha: 1, duration: 1.2, ease: "power3.out", delay: 0.2 
                            });
                        }
                    });
                });
            }
        }
    } else {
        document.body.style.opacity = '1';
    }

    // 2. MENÚ MÓVIL (Con corrección de choques)
    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(menuBtn && mobileMenu) {
        const icon = menuBtn.querySelector('i');
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isClosed = mobileMenu.classList.toggle('hidden');
            if(icon) {
                icon.classList.toggle('fa-bars', isClosed);
                icon.classList.toggle('fa-xmark', !isClosed);
            }
        });
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                if(icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
            }
        });
    }

    // 3. NAVEGACIÓN ENTRE PÁGINAS Y SCROLL
    document.querySelectorAll('a.nav-link, a.mobile-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if(mobileMenu) mobileMenu.classList.add('hidden');
                return;
            }

            if (targetId.includes('.html')) {
                const currentPath = window.location.pathname;
                if (currentPath.includes(targetId)) return;

                e.preventDefault();
                document.body.style.transition = 'opacity 0.4s ease';
                document.body.style.opacity = '0';
                setTimeout(() => { window.location.href = targetId; }, 400);
            }
        });
    });

    // 4. ANIMACIONES REVEAL
    const sections = document.querySelectorAll('.reveal');
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        sections.forEach(sec => observer.observe(sec));
    }

    // 5. LÓGICA MODO LUZ/NOCHE SIN REINICIOS
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('zazkee_theme') || 'dark';

    function applyTheme(theme, isInitialLoad = false) {
        const isLight = theme === 'light';
        const targetSrc = isLight ? 'videoLuz.mp4' : 'videoNo.mp4';
        const targetPoster = isLight ? 'poster-luz.jpg' : 'poster-noche.jpg';

        if (isLight) {
            htmlEl.classList.remove('dark');
            document.querySelectorAll('.fa-moon').forEach(el => { el.classList.remove('fa-moon'); el.classList.add('fa-sun'); });
            if (videoOverlay) { videoOverlay.classList.remove('bg-black/60'); videoOverlay.classList.add('bg-white/60'); }
            localStorage.setItem('zazkee_theme', 'light');
        } else {
            htmlEl.classList.add('dark');
            document.querySelectorAll('.fa-sun').forEach(el => { el.classList.remove('fa-sun'); el.classList.add('fa-moon'); });
            if (videoOverlay) { videoOverlay.classList.remove('bg-white/60'); videoOverlay.classList.add('bg-black/60'); }
            localStorage.setItem('zazkee_theme', 'dark');
        }

        if (bgVideo) {
            const currentSrc = bgVideo.getAttribute('src') || '';
            if (currentSrc !== targetSrc) {
                if (isInitialLoad) {
                    bgVideo.poster = targetPoster;
                    bgVideo.src = targetSrc;
                } else {
                    bgVideo.style.opacity = '0';
                    setTimeout(() => {
                        bgVideo.poster = targetPoster;
                        bgVideo.src = targetSrc;
                        bgVideo.play().catch(()=>{});
                        bgVideo.style.opacity = '0.9';
                    }, 300);
                }
            } else {
                bgVideo.style.opacity = '0.9';
            }
        }
    }

    applyTheme(savedTheme, true);

    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = htmlEl.classList.contains('dark') ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark', false);
        });
    });

    // =========================================================
    // 6. BACKEND: INTEGRACIÓN CON SUPABASE & LOGIN DE X (SEGURO)
    // =========================================================
    
    // El código solo se ejecuta si el script de Supabase se cargó correctamente
    if (typeof window.supabase !== 'undefined') {
        
        // ¡REEMPLAZA ESTO! PON TUS DATOS ADENTRO DE LAS COMILLAS DOBLES
        const supabaseUrl = "https://yhggkrhppvimfikiylbp.supabase.co"; 
        const supabaseKey = "sb_publishable_705SiIydShE9qdE1mVZIRg_Hb4g9bIA"; 
        
        // 🚨 PRUEBA DEFINITIVA: DETECTOR DE LLAVES
        if (!supabaseKey || supabaseKey.includes("TU_") || supabaseKey === "") {
            alert("🚨 ALERTA: La variable supabaseKey está vacía, mal escrita, o tiene el texto de relleno.");
        } else {
            console.log("✅ Supabase configurado. Llave detectada. Primeros caracteres:", supabaseKey.substring(0, 15));
        }

        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        const loginBtnDesktop = document.getElementById('btn-login-x-desktop');
        const loginBtnMobile = document.getElementById('btn-login-x-mobile');

        async function signInWithTwitter() {
            if (loginBtnDesktop) loginBtnDesktop.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            if (loginBtnMobile) loginBtnMobile.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'twitter',
            });
            if (error) {
                console.error("Error al iniciar sesión:", error.message);
                alert("Hubo un error al conectar con X. Revisa la consola.");
                updateLoginUI(null); // Restaurar botón
            }
        }

        function updateLoginUI(session) {
            if (session) {
                const username = session.user.user_metadata.user_name || session.user.user_metadata.preferred_username || 'Tribe Member';
                const loggedInHTML = `<i class="fa-brands fa-x-twitter"></i> @${username}`;
                
                if (loginBtnDesktop) {
                    loginBtnDesktop.innerHTML = loggedInHTML;
                    loginBtnDesktop.classList.add('bg-brandGold', 'text-black');
                    loginBtnDesktop.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
                }
                if (loginBtnMobile) {
                    loginBtnMobile.innerHTML = loggedInHTML;
                    loginBtnMobile.classList.add('bg-brandGold', 'text-black');
                    loginBtnMobile.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
                }
            } else {
                const loggedOutHTML = `<i class="fa-brands fa-x-twitter"></i> Connect X`;
                if (loginBtnDesktop) loginBtnDesktop.innerHTML = loggedOutHTML;
                if (loginBtnMobile) loginBtnMobile.innerHTML = loggedOutHTML;
            }
        }

        async function checkUserSession() {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error validando sesión:", error);
            }
            updateLoginUI(session);

            supabase.auth.onAuthStateChange((_event, session) => {
                updateLoginUI(session);
            });
        }

        if (loginBtnDesktop) loginBtnDesktop.addEventListener('click', signInWithTwitter);
        if (loginBtnMobile) loginBtnMobile.addEventListener('click', signInWithTwitter);

        checkUserSession();
    } else {
        console.warn("Supabase no está cargado en esta página. Las funciones Web3 están en pausa.");
    }
});