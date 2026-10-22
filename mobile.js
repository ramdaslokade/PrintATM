/* ==========================================
   PRINT ATM — Mobile Script
   ========================================== */

const state = {
    file: null,
    paperSize: 'A4',
    printMode: 'BW',
    copies: 1,
    pages: 'ALL',
    customPages: '',
    paymentMethod: 'UPI',
    pageCount: 1
};

const PRICES = { A4: 2, A3: 5, Letter: 2 };
const MODE_MULT = { BW: 1, COLOR: 5 };

/* ---------- SCREEN NAVIGATION ---------- */
function showScreen(n) {
    document.querySelectorAll('.m-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen${n}`).classList.add('active');
    document.querySelectorAll('.m-progress-step').forEach((s, i) => {
        const step = i + 1;
        s.classList.remove('active', 'done');
        if (step < n) s.classList.add('done');
        else if (step === n) s.classList.add('active');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- FILE UPLOAD ---------- */
const pdfInput = document.getElementById('pdfInput');
const fileCard = document.getElementById('fileCard');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFile = document.getElementById('removeFile');
const nextToSettings = document.getElementById('nextToSettings');

pdfInput?.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
        alert('Please select a valid PDF file');
        return;
    }
    if (f.size > 20 * 1024 * 1024) {
        alert('File size must be under 20MB');
        return;
    }
    state.file = f;
    state.pageCount = Math.floor(Math.random() * 8) + 1;

    fileName.textContent = f.name;
    fileSize.textContent = (f.size / 1024).toFixed(1) + ' KB • ' + state.pageCount + ' pages';
    fileCard.classList.remove('hidden');
    nextToSettings.disabled = false;
});

removeFile?.addEventListener('click', () => {
    state.file = null;
    pdfInput.value = '';
    fileCard.classList.add('hidden');
    nextToSettings.disabled = true;
});

nextToSettings?.addEventListener('click', () => {
    if (state.file) showScreen(2);
});

/* ---------- SETTINGS ---------- */
document.querySelectorAll('.m-chips').forEach(group => {
    group.addEventListener('click', (e) => {
        const chip = e.target.closest('.m-chip');
        if (!chip) return;
        group.querySelectorAll('.m-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        if (chip.dataset.paper) state.paperSize = chip.dataset.paper;
        if (chip.dataset.mode) state.printMode = chip.dataset.mode;
        if (chip.dataset.pages) {
            state.pages = chip.dataset.pages;
            document.getElementById('customPages').classList.toggle('hidden', state.pages !== 'CUSTOM');
        }
        updatePrice();
    });
});

document.getElementById('customPages')?.addEventListener('input', (e) => {
    state.customPages = e.target.value;
    updatePrice();
});

/* ---------- COPIES ---------- */
const copyValue = document.getElementById('copyValue');
document.getElementById('copyMinus')?.addEventListener('click', () => {
    if (state.copies > 1) { state.copies--; copyValue.textContent = state.copies; updatePrice(); }
});
document.getElementById('copyPlus')?.addEventListener('click', () => {
    if (state.copies < 10) { state.copies++; copyValue.textContent = state.copies; updatePrice(); }
});

/* ---------- PRICE ---------- */
function calculateTotal() {
    const price = PRICES[state.paperSize] || 2;
    const mult = MODE_MULT[state.printMode] || 1;
    return price * mult * state.pageCount * state.copies;
}

function updatePrice() {
    document.getElementById('priceDisplay').textContent = '₹' + calculateTotal();
}

/* ---------- NEXT TO PAY ---------- */
document.getElementById('nextToPay')?.addEventListener('click', () => {
    document.getElementById('sumFileName').textContent = state.file?.name || '-';
    document.getElementById('sumPages').textContent = state.pageCount;
    document.getElementById('sumCopies').textContent = state.copies;
    document.getElementById('sumMode').textContent = state.printMode === 'BW' ? 'B&W' : 'Colour';
    document.getElementById('sumTotal').textContent = '₹' + calculateTotal();
    showScreen(3);
});

document.getElementById('backTo1')?.addEventListener('click', () => showScreen(1));
document.getElementById('backTo2')?.addEventListener('click', () => showScreen(2));

/* ---------- PAYMENT METHOD ---------- */
document.querySelectorAll('.m-pay-method').forEach(m => {
    m.addEventListener('click', () => {
        document.querySelectorAll('.m-pay-method').forEach(x => x.classList.remove('active'));
        m.classList.add('active');
        state.paymentMethod = m.dataset.pay;
    });
});

/* ---------- PAY ---------- */
document.getElementById('payBtn')?.addEventListener('click', () => {
    showScreen(4);
    simulatePrinting();
});

/* ---------- STATUS SIMULATION ---------- */
function simulatePrinting() {
    const steps = [
        { icon: '💳', text: 'Verifying payment...', done: 1 },
        { icon: '📤', text: 'Sending document to printer...', done: 2 },
        { icon: '🖨️', text: 'Printing in progress...', done: 3 },
        { icon: '✅', text: 'Print completed! Collect your prints.', done: 4 }
    ];

    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const stepEls = document.querySelectorAll('.m-status-step');

    let i = 0;
    function next() {
        if (i >= steps.length) return;
        const s = steps[i];
        statusIcon.textContent = s.icon;
        statusText.textContent = s.text;

        stepEls.forEach((el, idx) => {
            el.classList.remove('active', 'done');
            if (idx + 1 < s.done) el.classList.add('done');
            else if (idx + 1 === s.done) el.classList.add('active');
        });

        i++;
        if (i < steps.length) setTimeout(next, 2000);
        else {
            stepEls.forEach(el => el.classList.remove('active'));
            stepEls.forEach(el => el.classList.add('done'));
        }
    }
    next();
}

/* ---------- NEW PRINT ---------- */
document.getElementById('newPrint')?.addEventListener('click', () => {
    state.file = null;
    state.copies = 1;
    state.printMode = 'BW';
    state.paperSize = 'A4';
    state.pages = 'ALL';
    document.getElementById('pdfInput').value = '';
    document.getElementById('fileCard').classList.add('hidden');
    document.getElementById('nextToSettings').disabled = true;
    document.getElementById('copyValue').textContent = '1';
    document.querySelectorAll('.m-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-paper="A4"]').classList.add('active');
    document.querySelector('[data-mode="BW"]').classList.add('active');
    document.querySelector('[data-pages="ALL"]').classList.add('active');
    updatePrice();
    showScreen(1);
});

/* ---------- INIT ---------- */
updatePrice();