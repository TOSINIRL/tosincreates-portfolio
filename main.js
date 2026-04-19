(function() {
    // 0. Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeDot = document.querySelector('.theme-dot');
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorOuter = document.querySelector('.cursor-outer');

    // Robust Initialization
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
            if (themeToggle) {
                themeToggle.classList.remove('dark-active');
                gsap.set(themeDot, { x: 0 });
            }
        } else {
            body.classList.remove('light-theme');
            if (themeToggle) {
                themeToggle.classList.add('dark-active');
                gsap.set(themeDot, { x: 22 });
            }
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-theme');
            const theme = isLight ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            
            // UI Sync
            themeToggle.classList.toggle('dark-active', !isLight);
            gsap.to(themeDot, { 
                x: isLight ? 0 : 22, 
                duration: 0.4, 
                ease: "back.out(1.7)" 
            });
        });
        
        // Initial setup
        initTheme();
    }

    // 0.1 Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';

            // Animation for links
            if (isOpen) {
                gsap.from('.mobile-nav-links li', {
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.2
                });
            }
        });

        // Close menu when link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }




    // 0. Mob Psycho Preloader & Site Reveal (Restored)
    const initPreloader = () => {
        const loadCount = document.getElementById('load-count');
        const preloader = document.getElementById('preloader');
        
        if (!preloader) return;

        // Force preloader every time for verification (removed sessionStorage check)
        
        document.body.classList.add('js-loading');
        const tl = gsap.timeline();
        let progressVal = { value: 0 };

        // Animate counter
        tl.to(progressVal, {
            value: 100,
            duration: 3,
            ease: "power2.inOut",
            onUpdate: () => {
                const rounded = Math.floor(progressVal.value);
                if (loadCount) {
                    loadCount.textContent = rounded;
                    // Mob Intensity Transitions
                    if (rounded >= 90) preloader.classList.add('mob-intensity-high');
                    if (rounded >= 99) loadCount.classList.add('glitch');
                }
            }
        })
        .to('.shigeo-aura', {
            opacity: 1,
            duration: 1.5,
            ease: "power2.in"
        }, "-=1.5")
        // Pause for impact at 100%
        .to({}, { duration: 0.8 }) 
        // Dismiss Preloader
        .to(preloader, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                preloader.style.display = 'none';
                preloader.style.zIndex = '-1'; 
                document.body.classList.remove('js-loading');
                sessionStorage.setItem('preloader_shown', 'true');
                gsap.set(['header', 'main'], { opacity: 1, visibility: 'visible', pointerEvents: 'all' });
            }
        })
        // Reveal site content
        .to(['header', 'main'], {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=0.5")
        .to('.watermark-text', {
            opacity: 0.03,
            y: 0,
            duration: 1.5,
            stagger: 0.3
        }, "-=1");
    };

    // Initialize Preloader
    initPreloader();

    // 1. Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const players = {};
    const videoData = [
        { id: 'monkey-player', videoId: 'UNarPhkqDD0', cardClass: '.featured-monkey', title: 'HOW TO RIZZ UP EVERY BADDIE 😈 (MONKEY APP)' },
        { id: 'shangchi-player', videoId: '1UVkZgmm4Gk', cardClass: '.featured-shangchi', title: 'WHEN SHANG CHI WAS PUTTING BTA ON HIS POPS' }
    ];

    window.onYouTubeIframeAPIReady = () => {
        videoData.forEach(data => setupVideo(data));
    };

    function setupVideo(data) {
        const card = document.querySelector(data.cardClass);
        if (!card) return;

        const img = card.querySelector('.thumbnail-img');
        const title = card.querySelector('.video-title');
        const volBtn = card.querySelector('.volume-control');
        const dot = volBtn.querySelector('.dot');
        
        if (title) title.innerText = data.title;
        if (img) img.src = `https://i.ytimg.com/vi/${data.videoId}/hqdefault.jpg`;

        // Initialize Player
        players[data.id] = new YT.Player(data.id, {
            height: '100%',
            width: '100%',
            videoId: data.videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'loop': 1,
                'playlist': data.videoId,
                'playsinline': 1,
                'mute': 1,
                'enablejsapi': 1
            },
            events: {
                'onReady': (event) => { event.target.mute(); },
                'onStateChange': (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        gsap.to(event.target.getIframe(), { opacity: 1, duration: 0.4 });
                        gsap.to(img, { opacity: 0, duration: 0.4 });
                    }
                }
            }
        });

        // Volume Toggle Sync
        let audioOn = localStorage.getItem('audio_preview') === 'true';
        if (audioOn) {
            volBtn.classList.add('on');
            gsap.set(dot, { x: 22 });
        }

        volBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audioOn = !audioOn;
            localStorage.setItem('audio_preview', audioOn);
            volBtn.classList.toggle('on', audioOn);
            gsap.to(dot, { x: audioOn ? 22 : 0, duration: 0.4, ease: "back.out" });

            if (players[data.id]) {
                if (audioOn) players[data.id].unMute();
                else players[data.id].mute();
            }
        });

        // Hover Logic
        card.addEventListener('mouseenter', () => {
            const player = players[data.id];
            if (player && player.playVideo) {
                if (localStorage.getItem('audio_preview') === 'true') player.unMute();
                else player.mute();
                player.playVideo();
            }
            gsap.to(card, { scale: 1.02, duration: 0.4, ease: "power2.out" });
        });

        card.addEventListener('mouseleave', () => {
            const player = players[data.id];
            if (player && player.pauseVideo) player.pauseVideo();
            gsap.to(card.querySelector('iframe'), { opacity: 0, duration: 0.2 });
            gsap.to(img, { opacity: 1, duration: 0.2 });
            gsap.to(card, { scale: 1, duration: 0.4 });
        });
    }

    // 2. Social Stats Real-Time Logic
    const initSocialStats = () => {
        const subDisplay = document.getElementById('sub-count');
        const discordDisplay = document.getElementById('discord-count');
        
        if (!subDisplay || !discordDisplay) return;

        // Configuration
        const CONFIG = {
            discordInvite: 'CVVjUz86S9',
            youtubeChannelId: 'UCck1kagNTkAlriBIRE8NPog',
            youtubeApiKey: 'AIzaSyDI7ia--llieRsL_TaPVw5p0A1-B9UdHrE',
            refreshInterval: 60000 // 1 minute
        };

        const state = {
            subs: 1590, // Fallback
            discord: 5   // Fallback
        };

        const animateValue = (el, start, end, suffix = "") => {
            let obj = { val: start };
            gsap.to(obj, {
                val: end,
                duration: 1.5,
                ease: "power2.out",
                onUpdate: () => {
                    const val = Math.floor(obj.val);
                    if (suffix === "K" && val >= 1000) {
                        el.textContent = (val / 1000).toFixed(2) + "K";
                    } else if (suffix === "K") {
                        el.textContent = val.toLocaleString();
                    } else {
                        el.textContent = val.toLocaleString();
                    }
                }
            });

            // Pulse effect on update
            const dot = el.previousElementSibling;
            if (dot && dot.classList.contains('pulse-dot')) {
                gsap.to(dot, { 
                    scale: 1.5, 
                    backgroundColor: "#00ff88", 
                    duration: 0.3, 
                    yoyo: true, 
                    repeat: 1 
                });
            }
        };

        const fetchStats = async () => {
            try {
                // 1. Fetch Discord Data (Keyless)
                const discordRes = await fetch(`https://discord.com/api/v9/invites/${CONFIG.discordInvite}?with_counts=true`);
                const discordData = await discordRes.json();
                if (discordData.approximate_member_count !== undefined) {
                    const newDiscord = discordData.approximate_member_count;
                    if (newDiscord !== state.discord) {
                        animateValue(discordDisplay, state.discord, newDiscord);
                        state.discord = newDiscord;
                    }
                }

                // 2. Fetch YouTube Data (Requires Key)
                if (CONFIG.youtubeApiKey) {
                    const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CONFIG.youtubeChannelId}&key=${CONFIG.youtubeApiKey}`);
                    const ytData = await ytRes.json();
                    if (ytData.items && ytData.items[0]) {
                        const newSubs = parseInt(ytData.items[0].statistics.subscriberCount);
                        if (newSubs !== state.subs) {
                            animateValue(subDisplay, state.subs, newSubs, "K");
                            state.subs = newSubs;
                        }
                    }
                } else {
                    // Slight variation to "feel" live if no key yet (simulated logic but keeping current state)
                    // Removing simulation to be honest, but initializing once
                }
            } catch (err) {
                console.warn("Failed to fetch live stats:", err);
            }
        };

        // Initial fetch
        fetchStats();

        // Entry Animation
        animateValue(subDisplay, 0, state.subs, "K");
        animateValue(discordDisplay, 0, state.discord);

        // Auto-refresh poll
        setInterval(fetchStats, CONFIG.refreshInterval);

        // Tab Switching Logic
        const tabs = document.querySelectorAll('.yt-tab');
        const videosContent = document.getElementById('videos-content');
        const communityContent = document.getElementById('community-content');
        const featuredVideo = document.querySelector('.hero-video-wrap');
        const interactiveHeader = document.querySelector('.more-videos-header');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const target = tab.getAttribute('data-tab');
                if (target === 'videos') {
                    videosContent.style.display = 'grid';
                    if (featuredVideo) featuredVideo.style.display = 'block';
                    if (interactiveHeader) interactiveHeader.style.display = 'block';
                    communityContent.style.display = 'none';
                } else {
                    videosContent.style.display = 'none';
                    if (featuredVideo) featuredVideo.style.display = 'none';
                    if (interactiveHeader) interactiveHeader.style.display = 'none';
                    communityContent.style.display = 'block';
                }
            });
        });
    };

    // --- Effects ---
    const initEffects = () => {
        initSocialStats();

        if (document.querySelector('.mission-reveal')) {
            gsap.from('.mission-reveal', {
                opacity: 0,
                y: 30,
                duration: 1,
                scrollTrigger: {
                    trigger: '.mission-reveal',
                    start: 'top 85%'
                }
            });
        }

        // Hero Watermark Parallax
        gsap.to('.hero-watermark', {
            y: 100,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Case Studies Grid Reveal
        const projectCards = gsap.utils.toArray('.project-card');
        if (projectCards.length > 0) {
            gsap.from(projectCards, {
                opacity: 0,
                y: 60,
                scale: 0.95,
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: '.project-grid',
                    start: 'top 85%',
                    toggleActions: "play none none reverse"
                }
            });
        }

        // About Section Reveal
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%',
                toggleActions: "play none none reverse"
            }
        });

        aboutTl.from('.about-content-left', {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        })
        .from('.about-content-right', {
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.8");
    };

    // 3. Grid / List View Toggle Logic
    const initViewToggle = () => {
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        const projectGrid = document.querySelector('.project-grid');
        const projectCards = gsap.utils.toArray('.project-card');

        if (!gridViewBtn || !listViewBtn || !projectGrid) return;

        const setView = (view) => {
            const isList = view === 'list';
            if (projectGrid.classList.contains('list-view') === isList) return;
            
            // UI Sync
            gridViewBtn.classList.toggle('active', !isList);
            listViewBtn.classList.toggle('active', isList);

            // High-Performance Animation
            const tl = gsap.timeline();

            tl.to(projectCards, {
                opacity: 0,
                scale: 0.95,
                duration: 0.2,
                stagger: 0.02,
                ease: "power2.in",
                force3D: true // Force GPU acceleration
            })
            .call(() => {
                projectGrid.classList.toggle('list-view', isList);
            })
            .to(projectCards, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.03,
                ease: "back.out(1.2)",
                force3D: true
            });

            localStorage.setItem('project_view', view);
        };

        gridViewBtn.addEventListener('click', () => setView('grid'));
        listViewBtn.addEventListener('click', () => setView('list'));

        // Initialize from storage
        const savedView = localStorage.getItem('project_view');
        if (savedView === 'list') {
            projectGrid.classList.add('list-view');
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
        }
    };

    // 4. ECOSYSTEM FEATURES
    const initEcosystem = () => {
        // Agentic Log Simulator
        const logContainer = document.getElementById('agenticLog');
        const logs = [
            'Analyzing viewport dynamics...',
            'Optimizing luxury delivery paths...',
            'Agent Tosin: Status Nominal.',
            'Executing logic-driven design...',
            'Syncing with AI ecosystem...',
            'Bespoke experience initiated.',
            'Neutralizing UI friction points...',
            'Aura synchronization: 100%',
            'Mastering agentic architecture...'
        ];

        let logIndex = 0;
        const addLog = () => {
            if (!logContainer) return;
            const line = document.createElement('div');
            line.className = 'log-line';
            line.innerHTML = `> ${logs[logIndex]}`;
            logContainer.appendChild(line);
            
            // Auto-scroll and maintain count
            if (logContainer.children.length > 5) {
                logContainer.removeChild(logContainer.firstChild);
            }
            
            logIndex = (logIndex + 1) % logs.length;
            setTimeout(addLog, Math.random() * 2000 + 1500);
        };
        addLog();

        // Interactive Logic Orb
        const orb = document.getElementById('logicOrb');
        if (orb) {
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX - window.innerWidth / 2) / 25;
                const y = (e.clientY - window.innerHeight / 2) / 25;
                gsap.to(orb, {
                    x: x,
                    y: y,
                    duration: 1.2,
                    ease: "power2.out"
                });
            });
        }

        // Magnetic Social Buttons (Pills and Hero Quick Links)
        const socialPills = document.querySelectorAll('.social-pill, .hero-social-quick a');
        socialPills.forEach(pill => {
            pill.addEventListener('mousemove', (e) => {
                const rect = pill.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(pill, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                const icon = pill.querySelector('i');
                gsap.to(icon, {
                    x: x * 0.5,
                    y: y * 0.5,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            pill.addEventListener('mouseleave', () => {
                gsap.to(pill, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
                const icon = pill.querySelector('i');
                gsap.to(icon, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    };

    // 0. SYSTEM CLOCK & GLOBAL NODES
    const updateClock = () => {
        const headerClock = document.getElementById('headerTime');
        const heroClock = document.getElementById('heroClock');
        const ldnClock = document.getElementById('clockLDN');
        const tkyClock = document.getElementById('clockTKY');
        const yyzClock = document.getElementById('clockYYZ');
        
        const now = new Date();
        
        // Helper for formatted time
        const getFormattedTime = (date, timezoneOffset) => {
            // Adjust for timezone
            const localDate = new Date(date.toLocaleString('en-US', { timeZone: timezoneOffset }));
            let h = localDate.getHours();
            const m = String(localDate.getMinutes()).padStart(2, '0');
            const s = String(localDate.getSeconds()).padStart(2, '0');
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
        };

        // Toronto (Local)
        const timeStr = getFormattedTime(now, 'America/Toronto');
        if (headerClock) headerClock.textContent = timeStr;
        if (heroClock) heroClock.textContent = timeStr;
        if (yyzClock) yyzClock.textContent = timeStr;

        // London
        if (ldnClock) ldnClock.textContent = getFormattedTime(now, 'Europe/London');
        
        // Tokyo
        if (tkyClock) tkyClock.textContent = getFormattedTime(now, 'Asia/Tokyo');

        setTimeout(updateClock, 1000);
    };
    updateClock();

    // 0. Status Dot Pulsing
    if (document.querySelector('.status-dot')) {
        gsap.to('.status-dot', {
            opacity: 0.2,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }

    // 5. CUSTOM GHOST CURSOR
    const initCursor = () => {
        if (!cursorInner || !cursorOuter) return;

        let mouseX = 0, mouseY = 0;
        let outerX = 0, outerY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Inner follows exactly
            gsap.to(cursorInner, {
                x: mouseX,
                y: mouseY,
                duration: 0.1,
                opacity: 1
            });
            
            gsap.to(cursorOuter, { opacity: 1, duration: 0.5 });
        });

        // Smooth outer follow
        const render = () => {
            outerX += (mouseX - outerX) * 0.15;
            outerY += (mouseY - outerY) * 0.15;
            
            gsap.set(cursorOuter, {
                x: outerX,
                y: outerY
            });
            
            requestAnimationFrame(render);
        };
        render();

        // Hover states
        const targets = document.querySelectorAll('a, button, .video-card, .project-card, .theme-switch');
        targets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorOuter, { width: 60, height: 60, duration: 0.3 });
                gsap.to(cursorInner, { scale: 2, backgroundColor: '#fff', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorOuter, { width: 35, height: 35, duration: 0.3 });
                gsap.to(cursorInner, { scale: 1, backgroundColor: 'var(--accent-red)', duration: 0.3 });
            });
        });
    };

    // 6. TEXT SCRAMBLE EFFECT
    const initScramble = () => {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        const headings = document.querySelectorAll('.about-heading, .contact-heading, .section-title, .yt-channel-name');

        headings.forEach(heading => {
            const originalText = heading.innerText;
            let iteration = 0;
            let interval = null;

            heading.addEventListener('mouseenter', () => {
                clearInterval(interval);
                interval = setInterval(() => {
                    heading.innerText = originalText
                        .split("")
                        .map((char, index) => {
                            if (index < iteration) return originalText[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("");

                    if (iteration >= originalText.length) {
                        clearInterval(interval);
                    }
                    iteration += 1 / 3;
                }, 30);
            });

            heading.addEventListener('mouseleave', () => {
                clearInterval(interval);
                iteration = 0;
                heading.innerText = originalText;
            });
        });
    };

    // Ensure GSAP plugins are ready
    setTimeout(() => {
        initEffects();
        initViewToggle();
        initEcosystem();
        initCursor();
        initScramble();
    }, 500);

})();
