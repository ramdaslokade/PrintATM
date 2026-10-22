<?php
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";

function getServerIP() {
    if (!empty($_SERVER['SERVER_ADDR']) && $_SERVER['SERVER_ADDR'] !== '127.0.0.1') {
        return $_SERVER['SERVER_ADDR'];
    }
    $hostname = gethostname();
    $ip = gethostbyname($hostname);
    if ($ip && $ip !== '127.0.0.1' && filter_var($ip, FILTER_VALIDATE_IP)) {
        return $ip;
    }
    if (function_exists('net_get_interfaces')) {
        $interfaces = net_get_interfaces();
        foreach ($interfaces as $name => $iface) {
            if (isset($iface['unicast']) && is_array($iface['unicast'])) {
                foreach ($iface['unicast'] as $addr) {
                    if (isset($addr['address']) 
                        && filter_var($addr['address'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)
                        && strpos($addr['address'], '127.') !== 0
                        && strpos($addr['address'], '169.254.') !== 0) {
                        return $addr['address'];
                    }
                }
            }
        }
    }
    return '127.0.0.1';
}

$port = $_SERVER['SERVER_PORT'] ?? '80';
$portSuffix = ($port && $port !== '80' && $port !== '443') ? ':' . $port : '';
$serverIP = getServerIP();
$path = dirname($_SERVER['PHP_SELF']);
$path = rtrim($path, '/\\');
if ($path === '' || $path === '.') $path = '';
$mobile_url = $protocol . $serverIP . $portSuffix . $path . "/print.php";
$qr_data = urlencode($mobile_url);
$qr_image = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data={$qr_data}&color=03040a&bgcolor=ffffff&margin=0&qzone=1";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print ATM | Smart Printing Kiosk</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body>

    <div class="bg-grid"></div>
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>
    <div class="bg-glow glow-3"></div>
    <canvas id="particles"></canvas>

    <div class="top-bar">
        <div class="top-left">
            <span class="live-indicator"><span class="live-dot"></span> LIVE</span>
            <span class="top-text">KIOSK ID: <b>PATM-2024-001</b></span>
        </div>
        <div class="top-right">
            <button class="lang-btn" id="langBtn" title="Change Language">
                <span>🌐</span> <span id="langLabel">EN</span>
            </button>
            <span class="top-text" id="clock">--:--:--</span>
        </div>
    </div>

    <main class="kiosk-screen">

        <header class="header">
            <div class="logo">
                <div class="logo-icon">
                    <span>P</span>
                    <div class="logo-ring"></div>
                    <div class="logo-shine"></div>
                </div>
                <div class="logo-text">
                    <h1>PRINT ATM</h1>
                    <p>SMART SELF-SERVICE PRINTING</p>
                </div>
            </div>

            <div class="header-stats">
                <div class="stat-box">
                    <div class="stat-icon">📄</div>
                    <div class="stat-info">
                        <small>PAPER</small>
                        <strong><span id="paper-count">742</span> sheets</strong>
                    </div>
                    <div class="stat-bar"><div class="stat-bar-fill" id="paper-bar" style="width:74%"></div></div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">🖨️</div>
                    <div class="stat-info">
                        <small>INK LEVEL</small>
                        <strong><span id="ink-level">84</span>%</strong>
                    </div>
                    <div class="stat-bar"><div class="stat-bar-fill" id="ink-bar" style="width:84%"></div></div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-info">
                        <small>QUEUE</small>
                        <strong><span id="queue-count">0</span> jobs</strong>
                    </div>
                    <div class="stat-bar"><div class="stat-bar-fill" id="queue-bar" style="width:0%"></div></div>
                </div>
            </div>

            <div class="status">
                <span class="status-dot"></span>
                <span id="statusText">MACHINE ONLINE</span>
            </div>
        </header>

        <section class="main-content">

            <div class="welcome">
                <div class="welcome-badge">
                    <span class="badge-dot"></span>
                    <span id="badgeText">FAST • EASY • SECURE</span>
                </div>

                <h2>
                    <span id="title1">Your Documents.</span><br>
                    <span class="gradient-text" id="title2">Printed Instantly.</span>
                </h2>

                <p class="description" id="descText">
                    Print your documents in just a few simple steps.
                    Scan the QR code using your mobile phone to get started.
                </p>

                <div class="steps">
                    <div class="step" data-step="1">
                        <div class="step-number">01</div>
                        <div class="step-content">
                            <strong id="step1">SCAN QR CODE</strong>
                            <small id="step1s">Scan using your mobile phone</small>
                        </div>
                        <div class="step-check">✓</div>
                    </div>
                    <div class="step" data-step="2">
                        <div class="step-number">02</div>
                        <div class="step-content">
                            <strong id="step2">UPLOAD DOCUMENT</strong>
                            <small id="step2s">Select a PDF from your phone</small>
                        </div>
                        <div class="step-check">✓</div>
                    </div>
                    <div class="step" data-step="3">
                        <div class="step-number">03</div>
                        <div class="step-content">
                            <strong id="step3">PAY & PRINT</strong>
                            <small id="step3s">Complete payment and collect prints</small>
                        </div>
                        <div class="step-check">✓</div>
                    </div>
                </div>

                <div class="payment-row">
                    <span class="pay-label">PAYMENT:</span>
                    <div class="pay-logos">
                        <span class="pay-chip">GPay</span>
                        <span class="pay-chip">PhonePe</span>
                        <span class="pay-chip">Paytm</span>
                        <span class="pay-chip">💳 Card</span>
                        <span class="pay-chip">💵 UPI</span>
                    </div>
                </div>
            </div>

            <div class="qr-panel">
                <div class="qr-heading">
                    <span class="scan-pulse"></span>
                    <span id="qrHeadingText">SCAN TO PRINT</span>
                </div>

                <div class="qr-wrapper">
                    <div class="qr-glow"></div>
                    <div class="qr-box" id="qrBox">
                        <img id="qr-image" src="<?php echo $qr_image; ?>" alt="Scan to Print QR Code">
                        <div class="qr-corner top-left"></div>
                        <div class="qr-corner top-right"></div>
                        <div class="qr-corner bottom-left"></div>
                        <div class="qr-corner bottom-right"></div>
                        <div class="qr-scan-line"></div>
                    </div>
                </div>

                <div style="width: 100%; margin-top: 10px; padding: 10px 14px; background: rgba(0, 229, 255, 0.06); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 10px;">
                    <div style="font-size: 9px; letter-spacing: 2px; color: #8b93b0; text-align: center; margin-bottom: 4px;">📱 MOBILE URL</div>
                    <div style="font-size: 10px; color: #00e5ff; text-align: center; word-break: break-all; font-family: 'Orbitron', monospace; line-height: 1.4;">
                        <?= htmlspecialchars($mobile_url) ?>
                    </div>
                </div>

                <h3 id="startPrintingText">Start Printing</h3>
                <p class="qr-description" id="qrDescText">
                    Open your phone camera and scan the QR code above.
                </p>

                <div class="session-timer">
                    <span>⏱️</span>
                    <span>Session: <b id="timer">00:00</b></span>
                </div>

                <button class="cta-btn" id="startBtn">
                    <span id="startBtnText">🚀 START NOW</span>
                </button>

                <div class="secure-label">
                    <span>🔒</span>
                    <span id="secureText">SECURE & PRIVATE PRINTING</span>
                </div>
            </div>

        </section>

        <footer class="footer">
            <span>© 2024 PRINT ATM</span>
            <span>📍 Self Service • Simple • Convenient</span>
            <span class="footer-help">Need help? Press <kbd>H</kbd></span>
        </footer>

    </main>

    <div class="modal" id="helpModal">
        <div class="modal-content">
            <button class="modal-close" id="helpClose">✕</button>
            <h3>🆘 Help & Support</h3>
            <div class="help-list">
                <div class="help-item"><b>Step 1:</b> Scan QR code with phone camera</div>
                <div class="help-item"><b>Step 2:</b> Upload your PDF document</div>
                <div class="help-item"><b>Step 3:</b> Pay via UPI / Card and collect prints</div>
                <div class="help-item"><b>Support:</b> Call 1800-XXX-XXXX (Toll Free)</div>
            </div>
            <p class="help-note">💡 Press <kbd>ESC</kbd> or click anywhere to close</p>
        </div>
    </div>

    <div class="toast" id="toast">
        <span id="toastIcon">✅</span>
        <span id="toastMsg">Ready!</span>
    </div>

    <script src="js/app.js"></script>
</body>
</html>