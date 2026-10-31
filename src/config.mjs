// Global site configuration — edit here, then run `node build.mjs`.
export default {
  // Final production domain (no trailing slash). Used for canonical, hreflang, sitemap, OG.
  siteUrl: 'https://www.naturafruct.ro',
  brand: 'NaturaFruct',
  slogan: '...doar fruct',

  company: {
    legalName: 'EKO NATURA FRUCT S.R.L.',
    tradeName: 'NaturaFruct',
    address: {
      street: 'Str. La Movila 2',
      locality: 'Loc. Corlata',
      commune: 'Com. Berchișești',
      county: 'Jud. Suceava',
      country: { ro: 'România', en: 'Romania' },
      postalCode: '727217',
      countryCode: 'RO',
      // Village-level coordinates (OpenStreetMap). Adjust to the exact building if needed.
      lat: 47.5443871,
      lng: 26.0470792,
    },
    regCom: 'J2009000798335',
    cui: '26079149',
    founded: '2009',
  },

  emails: {
    office: 'office@naturafruct.ro',
    sales: 'sales@naturafruct.ro',
  },

  // Display format + E.164 for tel: links
  phones: [
    { display: '0799 111 003', e164: '+40799111003' },
    { display: '0725 554 300', e164: '+40725554300' },
    { display: '0725 554 301', e164: '+40725554301' },
  ],

  // WhatsApp number in international format, digits only (used by the floating button)
  whatsapp: '40799111003',

  // Contact form endpoint (PHP handler copied to dist/contact.php)
  formEndpoint: '/contact.php',

  // Optional Cloudflare Turnstile site key (leave empty to disable). Secret goes in contact-config.php.
  turnstileSiteKey: '',
};
