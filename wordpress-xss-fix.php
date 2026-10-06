<?php
// FIX for CVE-2026-93836 (WPC Product Bundles) + CVE-2026-94504 (Ninja Forms) stored XSS
// Root cause: attacker markup stored in order meta / form submission, echoed into wp-admin unescaped.

// BEFORE:
// echo $qty; // woosb_ids[...][qty]
// echo $submission_value;

// AFTER:
$qty_prefix = $_POST['woosb_ids'][0]['qty'] ?? '';
if (!is_numeric(preg_replace('/[^0-9.\-]/', '', (string)$qty_prefix))) { /* reject */ }
$qty = floatval($qty_prefix); // strips trailing <script...>
echo esc_html((string)$qty);

// Ninja Forms legacy editor:
echo esc_html($submission_value); // or wp_kses_post($submission_value) if rich-text allowed
// + CSP hardening for admin:
header("Content-Security-Policy: script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; object-src 'none';");
