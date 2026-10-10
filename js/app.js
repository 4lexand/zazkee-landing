document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
document.documentElement.style.setProperty('height', 'auto', 'important');
document.body.style.setProperty('overflow-y', 'auto', 'important');
document.body.style.setProperty('height', 'auto', 'important');

document.addEventListener("DOMContentLoaded", () => {
    
    // (MANTENEMOS LÓGICA DE VIDEO Y MODO NOCHE INTACTA)
    const preloader = document.getElementById('preloader');
    const enterBtn = document.getElementById('enter-btn');
    const bgVideo = document.getElementById('bg-video');
    const videoOverlay = document.getElementById('video-overlay');

    if (preloader) {
        if (sessionStorage.getItem('zazkee_visited')) {
            preloader.style.display = 'none'; document.body.style.opacity = '1';
            if(window.innerWidth >= 1024) { gsap.set('#hero-img', { autoAlpha: 1, x: 0 }); } else { gsap.set('#hero-img', { autoAlpha: 1, y: 0 }); }
            gsap.set('.hero-element', { autoAlpha: 1, y: 0 });
        } else {
            let count = 0; const fill = document.getElementById('loading-text-fill'); const counter = document.getElementById('loader-counter');
            if(fill) fill.style.transition = 'width 0.1s linear';
            const interval = setInterval(() => {
                count += Math.floor(Math.random() * 3) + 1; if (count > 100) count = 100;
                if(counter) counter.textContent = count; if(fill) fill.style.width = count + '%';
                if (count === 100) {
                    clearInterval(interval);
                    if(enterBtn) { enterBtn.classList.remove('pointer-events-none'); enterBtn.style.opacity = '1'; enterBtn.style.visibility = 'visible'; }
                }
            }, 30);
            if(enterBtn) {
                enterBtn.addEventListener('click', () => {
                    sessionStorage.setItem('zazkee_visited', 'true');
                    const audio = new Audio('sound.mp3'); audio.volume = 0.3; audio.play().catch(()=>{});
                    gsap.to('#preloader', {
                        yPercent: -100, duration: 1, ease: "power4.inOut",
                        onComplete: () => {
                            document.body.style.opacity = '1';
                            gsap.to('.hero-element', { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power3.out" });
                            gsap.to('#hero-img', { x: 0, y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });
                        }
                    });
                });
            }
        }
    } else { document.body.style.opacity = '1'; }

    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if(menuBtn && mobileMenu) {
        const icon = menuBtn.querySelector('i');
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); const isClosed = mobileMenu.classList.toggle('hidden');
            if(icon) { icon.classList.toggle('fa-bars', isClosed); icon.classList.toggle('fa-xmark', !isClosed); }
        });
    }

    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('zazkee_theme') || 'dark';

    function applyTheme(theme, isInitialLoad = false) {
        const isLight = theme === 'light';
        const targetSrc = isLight ? 'videoLuz.mp4' : 'videoNo.mp4';
        const targetPoster = isLight ? 'poster-luz.jpg' : 'poster-noche.jpg';
        if (isLight) {
            htmlEl.classList.remove('dark'); document.querySelectorAll('.fa-moon').forEach(el => { el.classList.remove('fa-moon'); el.classList.add('fa-sun'); });
            if (videoOverlay) { videoOverlay.classList.remove('bg-black/60'); videoOverlay.classList.add('bg-white/60'); }
            localStorage.setItem('zazkee_theme', 'light');
        } else {
            htmlEl.classList.add('dark'); document.querySelectorAll('.fa-sun').forEach(el => { el.classList.remove('fa-sun'); el.classList.add('fa-moon'); });
            if (videoOverlay) { videoOverlay.classList.remove('bg-white/60'); videoOverlay.classList.add('bg-black/60'); }
            localStorage.setItem('zazkee_theme', 'dark');
        }
        if (bgVideo) {
            if (isInitialLoad) { bgVideo.poster = targetPoster; bgVideo.src = targetSrc; } 
            else {
                bgVideo.style.opacity = '0';
                setTimeout(() => { bgVideo.poster = targetPoster; bgVideo.src = targetSrc; bgVideo.play().catch(()=>{}); bgVideo.style.opacity = '0.9'; }, 300);
            }
        }
    }
    applyTheme(savedTheme, true);
    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach(btn => {
        btn.addEventListener('click', () => { const currentTheme = htmlEl.classList.contains('dark') ? 'dark' : 'light'; applyTheme(currentTheme === 'dark' ? 'light' : 'dark', false); });
    });

    // =========================================================
    // SUPABASE & DINAMISMO
    // =========================================================
    if (typeof window.supabase !== 'undefined') {
        const supabaseUrl = "https://yhggkrhppvimfikiylbp.supabase.co"; 
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZ2drcmhwcHZpbWZpa2l5bGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0ODAwNjcsImV4cCI6MjEwNzA1NjA2N30.fmj-5oeYlFNcg7hKeGpDzjAOpmV4AP6p7GiH0OirZls"; 
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        const loginBtnDesktop = document.getElementById('btn-login-x-desktop');
        const loginBtnMobile = document.getElementById('btn-login-x-mobile');

        async function signInWithX() {
            await supabase.auth.signInWithOAuth({ provider: 'x', options: { redirectTo: window.location.origin + '/giveaways.html' } });
        }

        // UI del Login (Desktop y Móvil)
        function updateLoginUI(session) {
            const username = session ? (session.user.user_metadata.user_name || session.user.user_metadata.preferred_username) : null;
            
            const htmlDesktop = session ? `<i class="fa-brands fa-x-twitter"></i> @${username}` : `<i class="fa-brands fa-x-twitter"></i> Connect X`;
            const htmlMobile = session ? `<i class="fa-brands fa-x-twitter"></i> <span class="truncate">@${username}</span>` : `<i class="fa-brands fa-x-twitter"></i> <span class="truncate">Connect</span>`;

            if (loginBtnDesktop) {
                loginBtnDesktop.innerHTML = htmlDesktop;
                if(session) { loginBtnDesktop.classList.add('bg-brandGold', 'text-black'); loginBtnDesktop.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black'); }
            }
            if (loginBtnMobile) {
                loginBtnMobile.innerHTML = htmlMobile;
                if(session) { loginBtnMobile.classList.add('bg-brandGold', 'text-black'); loginBtnMobile.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black'); }
            }
        }

        async function loadDynamicDrops() {
            const container = document.getElementById('dynamic-drops-container');
            if (!container) return; 

            const nowIso = new Date().toISOString();
            const { data: drops, error } = await supabase.from('drops').select('*').gt('expires_at', nowIso).order('created_at', { ascending: false });

            if (error || !drops || drops.length === 0) {
                container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400"><i class="fa-solid fa-ghost text-4xl mb-4 opacity-50"></i><p>No active drops at the moment. Stay tuned on X!</p></div>`; return;
            }

            container.innerHTML = drops.map(drop => {
                const diffTime = Math.abs(new Date(drop.expires_at) - new Date());
                const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                const daysText = diffDays === 1 ? 'Ends in 1 day' : `Ends in ${diffDays} days`;

                if (drop.drop_type === 'social') {
                    // Lógica para añadir sponsor al texto
                    let followText = `Follow @zazzkeee`;
                    if (drop.bonus_follow && drop.bonus_follow !== '') {
                        followText = `Follow @zazzkeee & ${drop.bonus_follow}`;
                    }

                    return `
                    <div class="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-brandGold/50 transition-all relative group flex flex-col h-full">
                        <div class="absolute top-4 right-4 bg-brandGold/20 text-brandGold text-xs px-3 py-1 rounded border border-brandGold/30 uppercase font-bold tracking-wider">Social Task</div>
                        <div class="w-16 h-16 mb-6">
                            <img src="giveaway.png" alt="Giveaway" class="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform">
                        </div>
                        <h3 class="text-2xl font-bold mb-1 text-white">${drop.title}</h3>
                        <p class="text-xs text-gray-400 mb-4 font-bold tracking-wider text-brandGold"><i class="fa-regular fa-clock mr-1"></i> ${daysText}</p>
                        
                        <div class="space-y-3 mb-4 flex-grow bg-black/40 p-5 rounded-xl border border-white/5">
                            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">Requirements:</p>
                            <div class="flex items-start text-sm text-gray-300"><i class="fa-solid fa-circle text-[6px] text-brandGold mt-1.5 mr-3"></i> ${followText}</div>
                            <div class="flex items-start text-sm text-gray-300"><i class="fa-solid fa-circle text-[6px] text-brandGold mt-1.5 mr-3"></i> Like, Repost & Tag a friend</div>
                        </div>
                        
                        <button class="btn-participate-dynamic w-full py-4 bg-brandGold text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.15)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]" data-drop-id="${drop.id}">
                            Verify & Participate
                        </button>
                    </div>`;
                } else if (drop.drop_type === 'code') {
                    const linkButton = drop.claim_url ? `<a href="${drop.claim_url}" target="_blank" class="w-full flex justify-center items-center py-4 mt-4 bg-white/5 text-white font-bold text-lg rounded-xl hover:bg-white/10 border border-white/20 transition-all"><i class="fa-solid fa-arrow-up-right-from-square mr-2"></i> Partner Link</a>` : '';
                    return `
                    <div class="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#00ff88]/50 transition-all relative group flex flex-col h-full">
                        <div class="absolute top-4 right-4 bg-[#00ff88]/20 text-[#00ff88] text-xs px-3 py-1 rounded border border-[#00ff88]/30 uppercase font-bold tracking-wider">Partner Code</div>
                        <div class="w-16 h-16 mb-6">
                            <img src="code.png" alt="Code" class="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,255,136,0.4)] group-hover:scale-110 transition-transform">
                        </div>
                        <h3 class="text-2xl font-bold mb-1 text-white">${drop.title}</h3>
                        <p class="text-xs text-gray-400 mb-4 font-bold tracking-wider text-[#00ff88]"><i class="fa-regular fa-clock mr-1"></i> ${daysText}</p>
                        <p class="text-sm text-gray-400 mb-6 flex-grow">Claim your exclusive partner code and use it to get rewards.</p>
                        
                        <button class="btn-reveal-code w-full py-4 bg-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/20 border border-white/20 transition-all" data-target="reveal-box-${drop.id}">Claim Drop</button>

                        <div id="reveal-box-${drop.id}" class="hidden flex-col w-full">
                            <div class="bg-black border border-dashed border-[#00ff88]/50 rounded-xl p-4 flex justify-between items-center mb-2">
                                <span class="text-[#00ff88] font-mono font-bold text-xl tracking-widest">${drop.secret_code || 'N/A'}</span>
                                <button class="text-gray-400 hover:text-white transition-colors btn-copy-code p-2" data-clipboard="${drop.secret_code}"><i class="fa-regular fa-copy"></i></button>
                            </div>
                            ${linkButton}
                        </div>
                    </div>`;
                }
            }).join('');

            attachDynamicListeners();
        }

        // LÓGICA DEL MODAL FORMAL
        function showVerifyModal(onConfirm) {
            const modal = document.getElementById('custom-verify-modal');
            const btnCancel = document.getElementById('modal-btn-cancel');
            const btnConfirm = document.getElementById('modal-btn-confirm');
            
            modal.classList.remove('hidden');

            const cleanup = () => {
                modal.classList.add('hidden');
                btnCancel.removeEventListener('click', handleCancel);
                btnConfirm.removeEventListener('click', handleConfirm);
            };

            const handleCancel = () => cleanup();
            const handleConfirm = () => { cleanup(); onConfirm(); };

            btnCancel.addEventListener('click', handleCancel);
            btnConfirm.addEventListener('click', handleConfirm);
        }

        function attachDynamicListeners() {
            document.querySelectorAll('.btn-reveal-code').forEach(btn => {
                btn.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    this.classList.add('hidden');
                    const revealBox = document.getElementById(targetId);
                    revealBox.classList.remove('hidden'); revealBox.classList.add('flex');
                });
            });

            document.querySelectorAll('.btn-participate-dynamic').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const dropId = this.getAttribute('data-drop-id');
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError || !session || !session.provider_token) return alert("⚠️ Session expired. Please Connect X again.");

                    // Aquí llamamos al modal bonito en lugar del feo confirm()
                    showVerifyModal(async () => {
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
                        this.style.pointerEvents = 'none';

                        try {
                            const response = await fetch('/api/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    provider_token: session.provider_token, username: session.user.user_metadata.user_name || session.user.user_metadata.preferred_username,
                                    user_id: session.user.id, twitter_id: session.user.user_metadata.provider_id,
                                    drop_id: dropId, target_tweet: '2105483856820240766', target_account: 'zazzkeee' 
                                })
                            });
                            const data = await response.json();
                            if (response.ok) { this.innerHTML = '<i class="fa-solid fa-check"></i> Confirmed!'; this.className = "w-full py-4 bg-green-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]"; } 
                            else if (data.error === 'already_entered') { this.innerHTML = '<i class="fa-solid fa-check-double"></i> Already Entered'; this.className = "w-full py-4 bg-blue-500 text-white font-bold text-lg rounded-xl"; } 
                            else { alert("Error: " + data.error); this.innerHTML = originalText; this.style.pointerEvents = 'auto'; }
                        } catch (error) { alert("Connection error."); this.innerHTML = originalText; this.style.pointerEvents = 'auto'; }
                    });
                });
            });

            document.querySelectorAll('.btn-copy-code').forEach(btn => {
                btn.addEventListener('click', function() {
                    const code = this.getAttribute('data-clipboard');
                    navigator.clipboard.writeText(code).then(() => {
                        const originalHTML = this.innerHTML; this.innerHTML = '<i class="fa-solid fa-check text-[#00ff88]"></i>';
                        setTimeout(() => this.innerHTML = originalHTML, 2000);
                    });
                });
            });
        }

        async function checkUserSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && !session.provider_token) { await supabase.auth.signOut(); updateLoginUI(null); } else { updateLoginUI(session); }
            supabase.auth.onAuthStateChange(async (_event, session) => {
                if (session && !session.provider_token) { await supabase.auth.signOut(); updateLoginUI(null); } else { updateLoginUI(session); }
            });
        }

        if (loginBtnDesktop) loginBtnDesktop.addEventListener('click', signInWithX);
        if (loginBtnMobile) loginBtnMobile.addEventListener('click', signInWithX);

        checkUserSession(); loadDynamicDrops(); 
    }
});