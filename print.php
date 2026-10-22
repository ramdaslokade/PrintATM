<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Print ATM | Mobile</title>
    <link rel="stylesheet" href="css/mobile.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>

<div class="m-bg-grid"></div>
<div class="m-bg-glow"></div>

<!-- HEADER -->
<header class="m-header">
    <div class="m-logo">
        <div class="m-logo-icon">P</div>
        <div>
            <div class="m-logo-title">PRINT ATM</div>
            <div class="m-logo-sub">MOBILE PRINTING</div>
        </div>
    </div>
    <div class="m-status"><span class="m-dot"></span> READY</div>
</header>

<!-- PROGRESS -->
<div class="m-progress">
    <div class="m-progress-step active" data-step="1">
        <span class="m-num">1</span><span>Upload</span>
    </div>
    <div class="m-progress-line"></div>
    <div class="m-progress-step" data-step="2">
        <span class="m-num">2</span><span>Settings</span>
    </div>
    <div class="m-progress-line"></div>
    <div class="m-progress-step" data-step="3">
        <span class="m-num">3</span><span>Pay</span>
    </div>
    <div class="m-progress-line"></div>
    <div class="m-progress-step" data-step="4">
        <span class="m-num">4</span><span>Print</span>
    </div>
</div>

<!-- STEP 1: UPLOAD -->
<section class="m-screen active" id="screen1">
    <h1 class="m-title">Upload Your Document</h1>
    <p class="m-subtitle">Select a PDF file from your phone</p>

    <label class="m-upload-zone" for="pdfInput">
        <div class="m-upload-icon">📄</div>
        <strong>Tap to Select PDF</strong>
        <small>Max size 20MB • Only PDF files</small>
        <input type="file" id="pdfInput" accept="application/pdf" hidden>
    </label>

    <div class="m-file-card hidden" id="fileCard">
        <div class="m-file-icon">📕</div>
        <div class="m-file-info">
            <div class="m-file-name" id="fileName">document.pdf</div>
            <div class="m-file-size" id="fileSize">0 KB</div>
        </div>
        <button class="m-remove" id="removeFile">✕</button>
    </div>

    <button class="m-btn" id="nextToSettings" disabled>CONTINUE →</button>
</section>

<!-- STEP 2: SETTINGS -->
<section class="m-screen" id="screen2">
    <h1 class="m-title">Print Settings</h1>
    <p class="m-subtitle">Choose your print preferences</p>

    <div class="m-group">
        <label>Paper Size</label>
        <div class="m-chips">
            <button class="m-chip active" data-paper="A4">A4</button>
            <button class="m-chip" data-paper="A3">A3</button>
            <button class="m-chip" data-paper="Letter">Letter</button>
        </div>
    </div>

    <div class="m-group">
        <label>Print Mode</label>
        <div class="m-chips">
            <button class="m-chip active" data-mode="BW">⚫ Black & White</button>
            <button class="m-chip" data-mode="COLOR">🎨 Colour</button>
        </div>
    </div>

    <div class="m-group">
        <label>Number of Copies</label>
        <div class="m-counter">
            <button class="m-count-btn" id="copyMinus">−</button>
            <span class="m-count-value" id="copyValue">1</span>
            <button class="m-count-btn" id="copyPlus">+</button>
        </div>
    </div>

    <div class="m-group">
        <label>Pages</label>
        <div class="m-chips">
            <button class="m-chip active" data-pages="ALL">All Pages</button>
            <button class="m-chip" data-pages="CUSTOM">Custom</button>
        </div>
        <input type="text" class="m-input hidden" id="customPages" placeholder="e.g. 1-5, 7, 9">
    </div>

    <div class="m-price-box">
        <span>Total Price</span>
        <strong id="priceDisplay">₹0</strong>
    </div>

    <button class="m-btn" id="nextToPay">CONTINUE TO PAYMENT →</button>
    <button class="m-btn m-btn-ghost" id="backTo1">← Back</button>
</section>

<!-- STEP 3: PAYMENT -->
<section class="m-screen" id="screen3">
    <h1 class="m-title">Payment</h1>
    <p class="m-subtitle">Complete payment to start printing</p>

    <div class="m-summary">
        <div class="m-summary-row"><span>File</span><b id="sumFileName">-</b></div>
        <div class="m-summary-row"><span>Pages</span><b id="sumPages">-</b></div>
        <div class="m-summary-row"><span>Copies</span><b id="sumCopies">-</b></div>
        <div class="m-summary-row"><span>Mode</span><b id="sumMode">-</b></div>
        <div class="m-summary-row total"><span>Total</span><b id="sumTotal">₹0</b></div>
    </div>

    <div class="m-pay-methods">
        <div class="m-pay-method active" data-pay="UPI">
            <span>💵</span><span>UPI</span>
        </div>
        <div class="m-pay-method" data-pay="GPay">
            <span>📱</span><span>GPay</span>
        </div>
        <div class="m-pay-method" data-pay="PhonePe">
            <span>💜</span><span>PhonePe</span>
        </div>
        <div class="m-pay-method" data-pay="Card">
            <span>💳</span><span>Card</span>
        </div>
    </div>

    <button class="m-btn m-btn-pay" id="payBtn">💳 PAY NOW</button>
    <button class="m-btn m-btn-ghost" id="backTo2">← Back</button>
</section>

<!-- STEP 4: STATUS -->
<section class="m-screen" id="screen4">
    <h1 class="m-title">Print Status</h1>
    <p class="m-subtitle">Your job is being processed</p>

    <div class="m-status-visual">
        <div class="m-status-icon" id="statusIcon">🖨️</div>
        <div class="m-status-text" id="statusText">Connecting to printer...</div>
    </div>

    <div class="m-status-steps">
        <div class="m-status-step active" data-st="1"><span>✓</span> Payment Received</div>
        <div class="m-status-step" data-st="2"><span>⏳</span> Sending to Printer</div>
        <div class="m-status-step" data-st="3"><span>⏳</span> Printing</div>
        <div class="m-status-step" data-st="4"><span>⏳</span> Completed</div>
    </div>

    <button class="m-btn" id="newPrint" style="margin-top:30px">🔄 New Print</button>
</section>

<footer class="m-footer">© 2024 Print ATM • Secure Printing</footer>

<script src="js/mobile.js"></script>
</body>
</html>