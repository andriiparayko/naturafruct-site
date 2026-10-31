<?php
// Contact form settings. This file is blocked from public access by .htaccess.
return [
    // Where inquiries are delivered
    'to'        => ['sales@naturafruct.ro'],
    'cc'        => ['office@naturafruct.ro'],

    // Sender — MUST be a mailbox on your own domain (SPF/DKIM), otherwise mail lands in spam.
    'from'      => 'no-reply@naturafruct.ro',
    'from_name' => 'NaturaFruct – site',
    'subject_prefix' => '[naturafruct.ro]',

    // Optional SMTP (recommended). Leave 'host' empty to use PHP mail().
    'smtp' => [
        'host'   => '',            // e.g. 'mail.naturafruct.ro'
        'port'   => 587,           // 587 (STARTTLS) or 465 (SSL)
        'secure' => 'tls',         // 'tls' | 'ssl' | ''
        'user'   => '',
        'pass'   => '',
    ],

    // Optional Cloudflare Turnstile secret (pair with turnstileSiteKey in src/config.mjs)
    'turnstile_secret' => '',

    // Anti-spam
    'rate_limit'  => 5,     // max messages per IP…
    'rate_window' => 3600,  // …per this many seconds
    'min_seconds' => 4,     // a human needs at least this long to fill the form
    'max_links'   => 2,     // messages with more URLs are rejected
];
