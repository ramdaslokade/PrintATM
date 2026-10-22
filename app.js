/* ==========================================
   PRINT ATM — Premium Kiosk v3.0
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. SOUND ENGINE ---------- */
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    function beep(freq = 800, dur = 0.08, type = 'sine') {
        try {
            if (!audioCtx) audioCtx = new AudioCtx();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + dur);
        } catch (e) {}
    }

    /* ---------- 2. LIVE CLOCK ---------- */
    const clockEl = document.getElementById('clock');
    const statusEl = document.getElementById('statusText');
    function updateClock() {
        const now = new Date();
        const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        if (clockEl) clockEl.textContent = t;
        if (statusEl) statusEl.textContent = `MACHINE ONLINE • ${t}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ---------- 3. STEP CYCLE ---------- */
    const steps = document.querySelectorAll('.step');
    let stepIdx = 0;
    function cycleStep() {
        steps.forEach((s, i) => s.classList.toggle('active', i === stepIdx));
        stepIdx = (stepIdx + 1) % steps.length;
    }
    if (steps.length) { cycleStep(); setInterval(cycleStep, 2400); }

    /* ---------- 4. PARTICLES ---------- */
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
        resize(); window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.op = Math.random() * 0.6 + 0.2;
                this.color = Math.random() > 0.5 ? '0,229,255' : '123,92,255';
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.op})`;
                ctx.fill();
            }
        }
        for (let i = 0; i < 70; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x, dy = p1.y - p2.y;
                    const d = Math.sqrt(dx*dx + dy*dy);
                    if (d < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0,229,255,${0.15 * (1 - d/100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ---------- 5. TOAST ---------- */
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimer;
    window.showToast = function(msg, icon = '✅') {
        if (!toast) return;
        toastMsg.textContent = msg;
        toastIcon.textContent = icon;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
    };

    /* ---------- 6. CONFETTI ---------- */
    function triggerConfetti() {
        const colors = ['#00e5ff', '#7b5cff', '#00ffa3', '#ffaa00', '#ff4757'];
        for (let i = 0; i < 60; i++) {
            const el = document.createElement('div');
            el.style.cssText = `
                position:fixed;left:${50 + (Math.random()-0.5)*20}%;top:50%;
                width:8px;height:8px;background:${colors[Math.floor(Math.random()*colors.length)]};
                border-radius:${Math.random()>0.5?'50%':'2px'};z-index:9999;pointer-events:none;
                box-shadow:0 0 10px currentColor;`;
            document.body.appendChild(el);
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 400 + 100;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;
            el.animate([
                { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 }
            ], { duration: 1200 + Math.random() * 600, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' })
            .onfinish = () => el.remove();
        }
    }

    /* ---------- 7. QR CLICK ---------- */
    const qrBox = document.getElementById('qrBox');
    if (qrBox) {
        qrBox.addEventListener('click', () => {
            qrBox.style.transform = 'scale(0.95)';
            setTimeout(() => qrBox.style.transform = '', 200);
            beep(900, 0.1);
            showToast('✅ QR Scanned! Opening mobile...', '✅');
            triggerConfetti();
        });
    }

    /* ---------- 8. START BUTTON ---------- */
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            beep(1200, 0.12);
            showToast('🚀 Session starting...', '🚀');
            triggerConfetti();
        });
    }

    /* ---------- 9. TIMER ---------- */
    const timerEl = document.getElementById('timer');
    let seconds = 0;
    if (timerEl) setInterval(() => {
        seconds++;
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
    }, 1000);

    /* ---------- 10. LIVE STATS ---------- */
    const paperEl = document.getElementById('paper-count');
    const paperBar = document.getElementById('paper-bar');
    const inkEl = document.getElementById('ink-level');
    const inkBar = document.getElementById('ink-bar');
    const queueEl = document.getElementById('queue-count');
    const queueBar = document.getElementById('queue-bar');

    if (paperEl) setInterval(() => {
        let n = Math.max(0, parseInt(paperEl.textContent) - Math.floor(Math.random() * 2));
        paperEl.textContent = n;
        if (paperBar) paperBar.style.width = Math.min(100, (n / 1000) * 100) + '%';
    }, 18000);
    if (inkEl) setInterval(() => {
        let n = Math.max(10, parseInt(inkEl.textContent) - 1);
        inkEl.textContent = n;
        if (inkBar) inkBar.style.width = n + '%';
    }, 60000);
    if (queueEl) setInterval(() => {
        let n = Math.floor(Math.random() * 3);
        queueEl.textContent = n;
        if (queueBar) queueBar.style.width = (n / 3) * 100 + '%';
    }, 8000);

    /* ---------- 11. LANGUAGE (3) ---------- */
    const langBtn = document.getElementById('langBtn');
    const langLabel = document.getElementById('langLabel');
    const langs = ['en', 'mr', 'hi'];
    let langIdx = 0;

    const T = {
        en: {
            badge: 'FAST • EASY • SECURE',
            title1: 'Your Documents.', title2: 'Printed Instantly.',
            desc: 'Print your documents in just a few simple steps. Scan the QR code using your mobile phone to get started.',
            step1: 'SCAN QR CODE', step1s: 'Scan using your mobile phone',
            step2: 'UPLOAD DOCUMENT', step2s: 'Select a PDF from your phone',
            step3: 'PAY & PRINT', step3s: 'Complete payment and collect prints',
            qrHeading: 'SCAN TO PRINT', startPrinting: 'Start Printing',
            qrDesc: 'Open your phone camera and scan the QR code above.',
            startBtn: '🚀 START NOW', secure: 'SECURE & PRIVATE PRINTING',
            lang: 'EN'
        },
        mr: {
            badge: 'वेगवान • सोपे • सुरक्षित',
            title1: 'तुमची कागदपत्रे.', title2: 'लगेच प्रिंट.',
            desc: 'फक्त काही सोप्या स्टेप्समध्ये तुमची कागदपत्रे प्रिंट करा. सुरुवात करण्यासाठी तुमच्या फोनने QR कोड स्कॅन करा.',
            step1: 'QR स्कॅन करा', step1s: 'तुमच्या मोबाईलने स्कॅन करा',
            step2: 'डॉक्युमेंट अपलोड करा', step2s: 'तुमच्या फोनवरून PDF निवडा',
            step3: 'पे & प्रिंट', step3s: 'पेमेंट करा आणि प्रिंट घ्या',
            qrHeading: 'स्कॅन करून प्रिंट करा', startPrinting: 'प्रिंटिंग सुरू करा',
            qrDesc: 'तुमचा फोन कॅमेरा उघडा आणि वरचा QR कोड स्कॅन करा.',
            startBtn: '🚀 आता सुरू करा', secure: 'सुरक्षित आणि खाजगी प्रिंटिंग',
            lang: 'मराठी'
        },
        hi: {
            badge: 'तेज़ • आसान • सुरक्षित',
            title1: 'आपके दस्तावेज़.', title2: 'तुरंत प्रिंट.',
            desc: 'कुछ आसान चरणों में अपने दस्तावेज़ प्रिंट करें। शुरू करने के लिए अपने फ़ोन से QR कोड स्कैन करें।',
            step1: 'QR स्कैन करें', step1s: 'अपने फ़ोन से स्कैन करें',
            step2: 'दस्तावेज़ अपलोड करें', step2s: 'अपने फ़ोन से PDF चुनें',
            step3: 'भुगतान और प्रिंट', step3s: 'भुगतान करें और प्रिंट लें',
            qrHeading: 'प्रिंट के लिए स्कैन करें', startPrinting: 'प्रिंटिंग शुरू करें',
            qrDesc: 'अपना फ़ोन कैमरा खोलें और ऊपर दिया गया QR कोड स्कैन करें।',
            startBtn: '🚀 अभी शुरू करें', secure: 'सुरक्षित और निजी प्रिंटिंग',
            lang: 'हिंदी'
        }
    };

    function applyLang(code) {
        const t = T[code];
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('badgeText', t.badge);
        set('title1', t.title1);
        set('title2', t.title2);
        set('descText', t.desc);
        set('step1', t.step1); set('step1s', t.step1s);
        set('step2', t.step2); set('step2s', t.step2s);
        set('step3', t.step3); set('step3s', t.step3s);
        set('qrHeadingText', t.qrHeading);
        set('startPrintingText', t.startPrinting);
        set('qrDescText', t.qrDesc);
        set('startBtnText', t.startBtn);
        set('secureText', t.secure);
        if (langLabel) langLabel.textContent = t.lang;
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            langIdx = (langIdx + 1) % langs.length;
            applyLang(langs[langIdx]);
            beep(700, 0.06);
            showToast(`🌐 ${T[langs[langIdx]].lang}`, '🌐');
        });
    }

    /* ---------- 12. HELP MODAL ---------- */
    const helpModal = document.getElementById('helpModal');
    const helpClose = document.getElementById('helpClose');
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'h') helpModal?.classList.add('active');
        if (e.key === 'Escape') helpModal?.classList.remove('active');
        if (e.key.toLowerCase() === 's' && qrBox) qrBox.click();
    });
    helpClose?.addEventListener('click', () => helpModal?.classList.remove('active'));
    helpModal?.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.classList.remove('active');
    });

    /* ---------- 13. PARALLAX ---------- */
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / innerWidth - 0.5) * 30;
        const y = (e.clientY / innerHeight - 0.5) * 30;
        document.querySelectorAll('.glow-1, .glow-2, .glow-3').forEach((g, i) => {
            const f = i === 1 ? -1 : 1;
            g.style.transform = `translate(${x*f}px, ${y*f}px)`;
        });
    });

    /* ---------- 14. CONSOLE ---------- */
    console.log('%c PRINT ATM v3.0 ', 'background:linear-gradient(90deg,#00e5ff,#7b5cff);color:#03040a;font-weight:900;font-size:18px;padding:10px 20px;border-radius:8px;');
    console.log('%c🎉 Ultra Premium Kiosk Ready', 'color:#00e5ff;font-weight:700;');
    console.log('%c⌨️ S = Scan | H = Help | ESC = Close', 'color:#8b93b0;');

    /* ---------- 15. INIT ---------- */
    setTimeout(() => showToast('👋 Welcome to Print ATM!', '👋'), 800);
});