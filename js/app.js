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

    // 1. LÓGICA DE CARGA INTELIGENTE
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

    // 2. MENÚ MÓVIL
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

    // 3. NAVEGACIÓN ENTRE PÁGINAS
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

    // 4. MODO LUZ/NOCHE
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
    // 5. BACKEND: INTEGRACIÓN CON SUPABASE (CARGA DINÁMICA DE DROPS)
    // =========================================================
    
    if (typeof window.supabase !== 'undefined') {
        const supabaseUrl = "https://yhggkrhppvimfikiylbp.supabase.co"; 
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZ2drcmhwcHZpbWZpa2l5bGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0ODAwNjcsImV4cCI6MjEwNzA1NjA2N30.fmj-5oeYlFNcg7hKeGpDzjAOpmV4AP6p7GiH0OirZls"; 
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        const loginBtnDesktop = document.getElementById('btn-login-x-desktop');
        const loginBtnMobile = document.getElementById('btn-login-x-mobile');

        async function signInWithX() {
            if (loginBtnDesktop) loginBtnDesktop.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            if (loginBtnMobile) loginBtnMobile.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'x',
                options: { redirectTo: window.location.origin + '/giveaways.html' }
            });
            
            if (error) {
                alert("Hubo un error al conectar con X.");
                updateLoginUI(null); 
            }
        }

        function updateLoginUI(session) {
            const loggedInHTML = session 
                ? `<i class="fa-brands fa-x-twitter"></i> @${session.user.user_metadata.user_name || session.user.user_metadata.preferred_username || 'User'}` 
                : `<i class="fa-brands fa-x-twitter"></i> Connect X`;

            [loginBtnDesktop, loginBtnMobile].forEach(btn => {
                if(btn) {
                    btn.innerHTML = loggedInHTML;
                    if(session) {
                        btn.classList.add('bg-brandGold', 'text-black');
                        btn.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
                    } else {
                        btn.classList.remove('bg-brandGold', 'text-black');
                        btn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
                    }
                }
            });
        }

        // --- CARGAR DROPS DINÁMICOS DESDE SUPABASE ---
        async function loadDynamicDrops() {
            const container = document.getElementById('dynamic-drops-container');
            if (!container) return; // Si no estamos en la página de giveaways, salimos.

            const { data: drops, error } = await supabase.from('drops').select('*').eq('status', 'active').order('created_at', { ascending: false });

            if (error || !drops || drops.length === 0) {
                container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">
                    <i class="fa-solid fa-ghost text-4xl mb-4 opacity-50"></i>
                    <p>No active drops at the moment. Stay tuned to @zazzkeee on X!</p>
                </div>`;
                return;
            }

            // Generar el HTML dependiendo del tipo de Drop e inyectar las imágenes locales
            container.innerHTML = drops.map(drop => {
                if (drop.drop_type === 'social') {
                    return `
                    <div class="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-brandGold/50 transition-all relative group flex flex-col h-full">
                        <div class="absolute top-4 right-4 bg-brandGold/20 text-brandGold text-xs px-3 py-1 rounded border border-brandGold/30 uppercase font-bold tracking-wider">Social Task</div>
                        
                        <!-- IMAGEN GIVEAWAY.PNG INTEGRADA -->
                        <div class="w-16 h-16 mb-6">
                            <img src="giveaway.png" alt="Giveaway Icon" class="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform duration-300">
                        </div>

                        <h3 class="text-2xl font-bold mb-3 text-white mt-4">${drop.title}</h3>
                        <p class="text-sm text-gray-400 mb-8 flex-grow">Complete the social tasks on X to secure your entry in the smart contract.</p>
                        
                        <div class="space-y-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
                            <div class="flex items-center text-sm text-gray-300"><i class="fa-solid fa-check-circle text-green-500 w-6"></i> Follow @zazzkeee</div>
                            <div class="flex items-center text-sm text-gray-300"><i class="fa-solid fa-check-circle text-green-500 w-6"></i> Like, Repost & Comment</div>
                        </div>
                        
                        <button class="btn-participate-dynamic w-full py-4 bg-brandGold text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.15)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]" data-drop-id="${drop.id}">
                            Verify & Participate
                        </button>
                    </div>`;
                } else if (drop.drop_type === 'code') {
                    return `
                    <div class="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#00ff88]/50 transition-all relative group flex flex-col h-full">
                        <div class="absolute top-4 right-4 bg-[#00ff88]/20 text-[#00ff88] text-xs px-3 py-1 rounded border border-[#00ff88]/30 uppercase font-bold tracking-wider">Partner Code</div>
                        
                        <!-- IMAGEN CODE.PNG INTEGRADA -->
                        <div class="w-16 h-16 mb-6">
                            <img src="code.png" alt="Code Icon" class="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,255,136,0.4)] group-hover:scale-110 transition-transform duration-300">
                        </div>

                        <h3 class="text-2xl font-bold mb-3 text-white mt-4">${drop.title}</h3>
                        <p class="text-sm text-gray-400 mb-8 flex-grow">Enter your secret partnership code to instantly claim this drop.</p>
                        
                        <input type="text" placeholder="Enter Secret Code..." class="w-full bg-black border border-white/20 rounded-xl p-4 text-white mb-4 outline-none focus:border-[#00ff88] transition-colors" id="code-${drop.id}">
                        
                        <button class="btn-claim-code w-full py-4 bg-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/20 border border-white/20 transition-all" data-drop-id="${drop.id}">
                            Claim Drop
                        </button>
                    </div>`;
                }
            }).join('');

            // Conectar los botones recién creados
            attachDynamicListeners();
        }

        // --- LÓGICA DE BOTONES PARA DROPS DINÁMICOS ---
        function attachDynamicListeners() {
            // Lógica para Drops Sociales (Verificación con Vercel API)
            document.querySelectorAll('.btn-participate-dynamic').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const dropId = this.getAttribute('data-drop-id');
                    
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError || !session || !session.provider_token) {
                        alert("⚠️ Session expired or invalid. Please click 'Connect X' on the top menu to refresh.");
                        return;
                    }

                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
                    this.style.pointerEvents = 'none';

                    try {
                        const response = await fetch('/api/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                provider_token: session.provider_token,
                                username: session.user.user_metadata.user_name || session.user.user_metadata.preferred_username,
                                user_id: session.user.id,
                                twitter_id: session.user.user_metadata.provider_id,
                                drop_id: dropId, 
                                target_tweet: '2105483856820240766', 
                                target_account: 'zazzkeee' 
                            })
                        });

                        const data = await response.json();

                        if (response.ok) {
                            this.innerHTML = '<i class="fa-solid fa-check"></i> Confirmed!';
                            this.classList.replace('bg-brandGold', 'bg-green-500');
                            this.classList.replace('text-black', 'text-white');
                        } else if (data.error === 'already_entered') {
                            this.innerHTML = '<i class="fa-solid fa-check-double"></i> Already Entered';
                            this.classList.replace('bg-brandGold', 'bg-blue-500');
                            this.classList.replace('text-black', 'text-white');
                        } else {
                            alert("Error: " + data.error);
                            this.innerHTML = originalText;
                            this.style.pointerEvents = 'auto';
                        }
                    } catch (error) {
                        console.error("Network error:", error);
                        alert("Connection error with verification server.");
                        this.innerHTML = originalText;
                        this.style.pointerEvents = 'auto';
                    }
                });
            });

            // Lógica para Drops de Código
            document.querySelectorAll('.btn-claim-code').forEach(btn => {
                btn.addEventListener('click', function() {
                    const dropId = this.getAttribute('data-drop-id');
                    const inputVal = document.getElementById(`code-${dropId}`).value.trim();
                    
                    if (!inputVal) {
                        alert("Please enter a code first.");
                        return;
                    }
                    
                    alert(`Checking code "${inputVal}" for drop ${dropId}... \n\n(Code validation system under maintenance)`);
                });
            });
        }

        async function checkUserSession() {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session && !session.provider_token) {
                await supabase.auth.signOut();
                updateLoginUI(null);
            } else {
                updateLoginUI(session);
            }

            supabase.auth.onAuthStateChange(async (_event, session) => {
                if (session && !session.provider_token) {
                    await supabase.auth.signOut();
                    updateLoginUI(null);
                } else {
                    updateLoginUI(session);
                }
            });
        }

        if (loginBtnDesktop) loginBtnDesktop.addEventListener('click', signInWithX);
        if (loginBtnMobile) loginBtnMobile.addEventListener('click', signInWithX);

        checkUserSession();
        loadDynamicDrops(); 
    }
});