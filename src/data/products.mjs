// Product catalogue — source: NaturaFruct Product Technical Specifications ENF-TS-01 … ENF-TS-13 (09.09.2026).
// Numbers use "." as decimal separator; the builder converts to "," for Romanian.
// To add a real photo later: set `image: '/assets/img/products/apple.webp'` on a product.

export const categories = [
  { id: 'concentrates', status: 'active' },
  { id: 'nectars', status: 'soon' },
  { id: 'tea', status: 'soon' },
];

export const groups = ['pome', 'stone', 'berry', 'grape'];

export const applications = ['beverages', 'juices', 'dairy', 'bakery', 'icecream', 'syrups', 'fermented', 'colour'];

// Shared organoleptic phrases
const APPEAR_CLEAR = {
  en: 'Clear, viscous liquid, free from visible foreign particles',
  ro: 'Lichid limpede, vâscos, fără particule străine vizibile',
};
const APPEAR_VISCOUS = {
  en: 'Viscous liquid, free from visible foreign particles',
  ro: 'Lichid vâscos, fără particule străine vizibile',
};
const CLARITY_CLEAR = {
  en: 'Clear, free from visible foreign particles',
  ro: 'Limpede, fără particule străine vizibile',
};
const CLARITY_CLOUDY = {
  en: 'Clear or slightly cloudy, depending on the clarification process',
  ro: 'Limpede sau ușor tulbure, în funcție de procesul de limpezire',
};

export const products = [
  {
    id: 'apple',
    doc: 'ENF-TS-01', rev: 'Rev. 01',
    group: 'pome', icon: 'apple',
    colors: ['#F3CF73', '#D9952B'],
    slug: { ro: 'concentrat-suc-de-mere', en: 'apple-juice-concentrate' },
    name: { ro: 'Concentrat de suc de mere', en: 'Apple juice concentrate' },
    fruit: { ro: 'Mere', en: 'Apple' },
    brix: '67–70',
    acidity: { value: '2.1–2.4', acid: 'malic' },
    extra: null,
    organoleptic: {
      appearance: APPEAR_CLEAR,
      colour: {
        en: 'Light amber to golden yellow, characteristic of concentrated apple juice',
        ro: 'De la chihlimbar deschis la galben-auriu, caracteristică sucului concentrat de mere',
      },
      taste: {
        en: 'Characteristic of concentrated apple juice',
        ro: 'Caracteristice sucului concentrat de mere',
      },
      clarity: CLARITY_CLEAR,
    },
    apps: ['beverages', 'juices', 'bakery', 'syrups', 'fermented', 'colour'],
    pdf: '/assets/docs/ENF-TS-01-apple-juice-concentrate.pdf',
    desc: {
      ro: 'Concentratul de suc de mere NaturaFruct se obține din mere atent selecționate, procesate în fabrica noastră din Bucovina. Are 67–70 °Brix, o culoare de la chihlimbar deschis la galben-auriu și gustul curat al mărului. Este baza clasică pentru sucuri reconstituite, nectaruri, băuturi răcoritoare și cidru, dar și un îndulcitor natural din fructe pentru panificație, cofetărie și preparate din fructe. Fiecare lot este însoțit de certificat de analiză și are trasabilitate completă.',
      en: 'NaturaFruct apple juice concentrate is made from carefully selected apples processed at our plant in Bucovina, Romania. At 67–70 °Brix it has a light amber to golden-yellow colour and a clean, characteristic apple taste. It is the classic base for juices from concentrate, nectars, soft drinks and cider, and a natural fruit sweetener for bakery, confectionery and fruit preparations. Every batch ships with a Certificate of Analysis and full traceability.',
    },
  },
  {
    id: 'blackcurrant',
    doc: 'ENF-TS-02', rev: 'Rev. 01',
    group: 'berry', icon: 'currant',
    colors: ['#7A2458', '#2E0A26'],
    slug: { ro: 'concentrat-suc-de-coacaze-negre', en: 'blackcurrant-juice-concentrate' },
    name: { ro: 'Concentrat de suc de coacăze negre', en: 'Blackcurrant juice concentrate' },
    fruit: { ro: 'Coacăze negre', en: 'Blackcurrant' },
    brix: '64–67',
    acidity: { value: '11–19', acid: 'malic' },
    extra: {
      name: { en: 'Colour intensity at 520 nm / 11.6 °Brix', ro: 'Intensitatea culorii la 520 nm / 11,6 °Bx' },
      unit: 'AU', value: '20–40',
    },
    organoleptic: {
      appearance: APPEAR_CLEAR,
      colour: {
        en: 'Deep red to dark purple, characteristic of concentrated blackcurrant juice',
        ro: 'De la roșu intens la violet închis, caracteristică sucului concentrat de coacăze negre',
      },
      taste: {
        en: 'Characteristic of blackcurrant, with a pronounced fruity and acidic taste, free from foreign tastes and odours',
        ro: 'Caracteristice coacăzelor negre, cu gust fructat și acidulat pronunțat, fără gusturi și mirosuri străine',
      },
      clarity: CLARITY_CLEAR,
    },
    apps: ['beverages', 'juices', 'dairy', 'icecream', 'syrups', 'colour'],
    desc: {
      ro: 'Concentrat de suc de coacăze negre cu 64–67 °Brix, culoare de la roșu intens la violet închis și aciditate ridicată (11–19%, exprimată ca acid malic). Profilul fructat și acidulat pronunțat îl recomandă pentru nectaruri, băuturi răcoritoare, siropuri și preparate din fructe pentru lactate. Datorită intensității culorii (20–40 AU la 520 nm), este folosit și ca sursă naturală de culoare în rețete. Produs în România, cu fișă tehnică și certificat de analiză pentru fiecare lot.',
      en: 'Blackcurrant juice concentrate at 64–67 °Brix, with a deep red to dark purple colour and high acidity (11–19 %, as malic acid). Its pronounced fruity, tangy profile makes it a strong choice for nectars, soft drinks, syrups and fruit preparations for dairy. Thanks to its colour intensity (20–40 AU at 520 nm), it is also used as a natural source of colour in recipes. Made in Romania, with a technical specification and a Certificate of Analysis for every batch.',
    },
  },
  {
    id: 'raspberry',
    doc: 'ENF-TS-03', rev: 'Rev. 01',
    group: 'berry', icon: 'raspberry',
    colors: ['#E0566F', '#9C1534'],
    slug: { ro: 'concentrat-suc-de-zmeura', en: 'raspberry-juice-concentrate' },
    name: { ro: 'Concentrat de suc de zmeură', en: 'Raspberry juice concentrate' },
    fruit: { ro: 'Zmeură', en: 'Raspberry' },
    brix: '64–66',
    acidity: { value: '10–16.5', acid: 'citric' },
    extra: {
      name: { en: 'Colour intensity at 520 nm / 9.2 °Bx', ro: 'Intensitatea culorii la 520 nm / 9,2 °Bx' },
      unit: 'AU', value: '≥ 7.0',
    },
    organoleptic: {
      appearance: APPEAR_VISCOUS,
      colour: {
        en: 'Red to dark red, characteristic of concentrated raspberry juice',
        ro: 'De la roșu la roșu închis, caracteristică sucului concentrat de zmeură',
      },
      taste: {
        en: 'Characteristic of raspberry, with a typical fruity and slightly acidic taste, free from foreign tastes and odours',
        ro: 'Caracteristice zmeurei, cu gust tipic fructat și ușor acidulat, fără gusturi și mirosuri străine',
      },
      clarity: {
        en: 'Characteristic of the product; may be slightly cloudy depending on the clarification process',
        ro: 'Caracteristică produsului; poate fi ușor tulbure, în funcție de procesul de limpezire',
      },
    },
    apps: ['beverages', 'dairy', 'bakery', 'icecream', 'syrups'],
    desc: {
      ro: 'Concentratul de suc de zmeură (64–66 °Brix) păstrează aroma delicată, fructată și ușor acidulată a zmeurei, cu o culoare de la roșu la roșu închis. Aciditatea de 10–16,5% (acid citric) aduce prospețime în băuturi, nectaruri și siropuri, dar și în iaurturi, înghețată și preparate din fructe pentru patiserie. Poate fi ușor tulbure, în funcție de procesul de limpezire. Livrat în ambalaj aseptic sau non-aseptic, cu trasabilitate pe lot.',
      en: 'Raspberry juice concentrate (64–66 °Brix) keeps the delicate, fruity and slightly tart aroma of raspberries, with a red to dark red colour. Its 10–16.5 % acidity (as citric acid) brings freshness to beverages, nectars and syrups, as well as yoghurts, ice cream and fruit preparations for bakery. It may be slightly cloudy depending on the clarification process. Supplied in aseptic or non-aseptic packaging with batch traceability.',
    },
  },
  {
    id: 'sour-cherry',
    doc: 'ENF-TS-04', rev: 'Rev. 01',
    group: 'stone', icon: 'cherry',
    colors: ['#B8263F', '#5E0A1C'],
    slug: { ro: 'concentrat-suc-de-visine', en: 'sour-cherry-juice-concentrate' },
    name: { ro: 'Concentrat de suc de vișine', en: 'Sour cherry juice concentrate' },
    fruit: { ro: 'Vișine', en: 'Sour cherry' },
    brix: '64–66',
    acidity: { value: '4.5–7.5', acid: 'citric' },
    extra: {
      name: { en: 'Colour index at 520 nm / 13.2 °Bx', ro: 'Indicele de culoare la 520 nm / 13,2 °Bx' },
      unit: 'AU', value: '≥ 7.0',
    },
    organoleptic: {
      appearance: APPEAR_VISCOUS,
      colour: {
        en: 'Red to dark red or red-violet, characteristic of concentrated sour cherry juice',
        ro: 'De la roșu la roșu închis sau roșu-violet, caracteristică sucului concentrat de vișine',
      },
      taste: {
        en: 'Characteristic of sour cherry, with a typical fruity and acidic taste, free from foreign tastes and odours',
        ro: 'Caracteristice vișinelor, cu gust tipic fructat și acidulat, fără gusturi și mirosuri străine',
      },
      clarity: CLARITY_CLOUDY,
    },
    apps: ['beverages', 'juices', 'dairy', 'bakery', 'syrups', 'fermented'],
    desc: {
      ro: 'Concentrat de suc de vișine cu 64–66 °Brix, culoare roșu închis până la roșu-violet și gustul fructat-acidulat specific vișinei. Este un ingredient apreciat pentru nectaruri, băuturi răcoritoare, lichioruri și vinuri de fructe, dar și pentru umpluturi și preparate din fructe pentru lactate. Aciditate 4,5–7,5% (acid citric), pH ≤ 3,5 și indice de culoare ≥ 7,0 AU la 520 nm. Fișă tehnică completă și certificat de analiză pe lot.',
      en: 'Sour cherry juice concentrate at 64–66 °Brix, with a dark red to red-violet colour and the typical fruity, tart taste of morello cherries. A sought-after ingredient for nectars, soft drinks, liqueurs and fruit wines, as well as fillings and fruit preparations for dairy. Acidity 4.5–7.5 % (as citric acid), pH ≤ 3.5 and a colour index of ≥ 7.0 AU at 520 nm. Full technical specification and a Certificate of Analysis per batch.',
    },
  },
  {
    id: 'strawberry',
    doc: 'ENF-TS-05', rev: 'Rev. 01',
    group: 'berry', icon: 'strawberry',
    colors: ['#EE6A6E', '#B01F33'],
    slug: { ro: 'concentrat-suc-de-capsuni', en: 'strawberry-juice-concentrate' },
    name: { ro: 'Concentrat de suc de căpșuni', en: 'Strawberry juice concentrate' },
    fruit: { ro: 'Căpșuni', en: 'Strawberry' },
    brix: '64–66',
    acidity: { value: '5.8–8.6', acid: 'citric' },
    extra: {
      name: { en: 'Colour intensity at 520 nm / 8.0 °Bx', ro: 'Intensitatea culorii la 520 nm / 8,0 °Bx' },
      unit: 'AU', value: '≥ 8.0',
    },
    organoleptic: {
      appearance: APPEAR_VISCOUS,
      colour: {
        en: 'Red to dark red, characteristic of concentrated strawberry juice',
        ro: 'De la roșu la roșu închis, caracteristică sucului concentrat de căpșuni',
      },
      taste: {
        en: 'Characteristic of strawberry, with a typical fruity, sweet and slightly acidic taste, free from foreign tastes and odours',
        ro: 'Caracteristice căpșunilor, cu gust tipic fructat, dulce și ușor acidulat, fără gusturi și mirosuri străine',
      },
      clarity: CLARITY_CLOUDY,
    },
    apps: ['beverages', 'dairy', 'bakery', 'icecream', 'syrups'],
    desc: {
      ro: 'Concentratul de suc de căpșuni NaturaFruct (64–66 °Brix) aduce gustul dulce, fructat și ușor acidulat al căpșunilor coapte și o culoare roșie naturală. Este potrivit pentru băuturi, nectaruri, iaurturi, înghețată, siropuri și umpluturi pentru produse de patiserie. Aciditate 5,8–8,6% (acid citric) și intensitatea culorii ≥ 8,0 AU la 520 nm. Disponibil în ambalaj aseptic sau non-aseptic, cu termen de valabilitate de până la 24 de luni.',
      en: 'NaturaFruct strawberry juice concentrate (64–66 °Brix) delivers the sweet, fruity and slightly tart taste of ripe strawberries with a natural red colour. It suits beverages, nectars, yoghurts, ice cream, syrups and bakery fillings. Acidity 5.8–8.6 % (as citric acid) and colour intensity ≥ 8.0 AU at 520 nm. Available in aseptic or non-aseptic packaging, with a shelf life of up to 24 months.',
    },
  },
  {
    id: 'aronia',
    doc: 'ENF-TS-06', rev: 'Rev. 01',
    group: 'berry', icon: 'aronia',
    colors: ['#6A1D4C', '#23061B'],
    slug: { ro: 'concentrat-suc-de-aronia', en: 'aronia-juice-concentrate' },
    name: { ro: 'Concentrat de suc de aronia', en: 'Aronia juice concentrate' },
    fruit: { ro: 'Aronia', en: 'Aronia (black chokeberry)' },
    brix: '64.5–65.5',
    acidity: { value: '2.5–6.0', acid: 'malic' },
    extra: {
      name: { en: 'Colour intensity at 520 nm / 11.6 °Brix', ro: 'Intensitatea culorii la 520 nm / 11,6 °Bx' },
      unit: 'AU', value: '30–60',
    },
    organoleptic: {
      appearance: {
        en: 'Clear or semi-fluid, viscous liquid, free from visible foreign particles',
        ro: 'Lichid vâscos, limpede sau semifluid, fără particule străine vizibile',
      },
      colour: {
        en: 'Deep red to dark purple, characteristic of concentrated aronia juice',
        ro: 'De la roșu intens la violet închis, caracteristică sucului concentrat de aronia',
      },
      taste: {
        en: 'Characteristic of aronia, with a typical tart and astringent taste, free from foreign tastes and odours',
        ro: 'Caracteristice aroniei, cu gust tipic acrișor și astringent, fără gusturi și mirosuri străine',
      },
      clarity: CLARITY_CLOUDY,
    },
    apps: ['beverages', 'juices', 'dairy', 'syrups', 'colour'],
    desc: {
      ro: 'Concentrat de suc de aronia (Aronia melanocarpa) cu 64,5–65,5 °Brix, culoare de la roșu intens la violet închis și gust acrișor, astringent, caracteristic. Datorită intensității ridicate a culorii (30–60 AU la 520 nm), este folosit ca sursă naturală de culoare în băuturi, siropuri și preparate din fructe, precum și în amestecuri cu sucuri mai dulci, cum ar fi cel de mere. Aciditate 2,5–6,0% (acid malic). Fără alergeni și fără OMG.',
      en: 'Aronia (black chokeberry) juice concentrate at 64.5–65.5 °Brix, with a deep red to dark purple colour and a characteristic tart, astringent taste. Its high colour intensity (30–60 AU at 520 nm) makes it a natural source of colour for beverages, syrups and fruit preparations, and a great partner in blends with sweeter juices such as apple. Acidity 2.5–6.0 % (as malic acid). Allergen-free and GMO-free.',
    },
  },
  {
    id: 'white-grape',
    doc: 'ENF-TS-07', rev: 'Rev. 01',
    group: 'grape', icon: 'grape',
    colors: ['#EED98A', '#C9A13E'],
    slug: { ro: 'concentrat-suc-de-struguri-albi', en: 'white-grape-juice-concentrate' },
    name: { ro: 'Concentrat de suc de struguri albi', en: 'White grape juice concentrate' },
    fruit: { ro: 'Struguri albi', en: 'White grape' },
    brix: '67–70',
    acidity: { value: '1.0–1.8', acid: 'tartaric' },
    extra: {
      name: { en: 'Absorbance at 440 nm / 16.0 °Bx', ro: 'Absorbanța la 440 nm / 16,0 °Bx' },
      unit: 'AU', value: '0.14–0.30',
    },
    organoleptic: {
      appearance: APPEAR_CLEAR,
      colour: {
        en: 'Light amber to golden yellow, characteristic of concentrated white grape juice',
        ro: 'De la chihlimbar deschis la galben-auriu, caracteristică sucului concentrat de struguri albi',
      },
      taste: {
        en: 'Characteristic of concentrated white grape juice',
        ro: 'Caracteristice sucului concentrat de struguri albi',
      },
      clarity: CLARITY_CLEAR,
    },
    apps: ['beverages', 'juices', 'syrups', 'fermented', 'colour'],
    desc: {
      ro: 'Concentratul de suc de struguri albi (67–70 °Brix) are o culoare de la chihlimbar deschis la galben-auriu, limpiditate ridicată și gustul dulce, caracteristic strugurilor. Este o bază versatilă pentru sucuri și nectaruri, băuturi răcoritoare, siropuri și băuturi fermentate, precum și un îndulcitor natural din fructe pentru industria alimentară. Aciditate 1,0–1,8% (acid tartric) și absorbanță 0,14–0,30 AU la 440 nm.',
      en: 'White grape juice concentrate (67–70 °Brix) has a light amber to golden-yellow colour, high clarity and the sweet, characteristic taste of grapes. It is a versatile base for juices and nectars, soft drinks, syrups and fermented beverages, and a natural fruit sweetener for the food industry. Acidity 1.0–1.8 % (as tartaric acid) and absorbance of 0.14–0.30 AU at 440 nm.',
    },
  },
  {
    id: 'red-grape',
    doc: 'ENF-TS-08', rev: 'Rev. 01',
    group: 'grape', icon: 'grape',
    colors: ['#8E2A5C', '#3C0A26'],
    slug: { ro: 'concentrat-suc-de-struguri-rosii', en: 'red-grape-juice-concentrate' },
    name: { ro: 'Concentrat de suc de struguri roșii', en: 'Red grape juice concentrate' },
    fruit: { ro: 'Struguri roșii', en: 'Red grape' },
    brix: '66–69',
    acidity: { value: '1.0–1.8', acid: 'tartaric' },
    extra: {
      name: { en: 'Colour absorbance at 520 nm / 16.0 °Bx', ro: 'Absorbanța culorii la 520 nm / 16,0 °Bx' },
      unit: 'AU', value: '≥ 400',
    },
    organoleptic: {
      appearance: APPEAR_CLEAR,
      colour: {
        en: 'Red to dark red or purple, characteristic of concentrated red grape juice',
        ro: 'De la roșu la roșu închis sau violet, caracteristică sucului concentrat de struguri roșii',
      },
      taste: {
        en: 'Characteristic of concentrated red grape juice, with a typical fruity and sweet-tart taste, free from fermented, scorched or other undesirable tastes and odours',
        ro: 'Caracteristice sucului concentrat de struguri roșii, cu gust tipic fructat, dulce-acrișor, fără gust de fermentat, de ars sau alte gusturi și mirosuri nedorite',
      },
      clarity: {
        en: 'Clear or slightly opalescent, free from visible foreign particles',
        ro: 'Limpede sau ușor opalescent, fără particule străine vizibile',
      },
    },
    apps: ['beverages', 'juices', 'syrups', 'fermented', 'colour'],
    desc: {
      ro: 'Concentrat de suc de struguri roșii cu 66–69 °Brix, culoare de la roșu închis la violet și gust fructat, dulce-acrișor. Absorbanța ridicată a culorii la 520 nm îl recomandă pentru băuturi, nectaruri, siropuri și băuturi fermentate, dar și ca sursă naturală de culoare și dulceață. Aciditate 1,0–1,8% (acid tartric). Fără gust de fermentat sau de ars — parametri verificați pentru fiecare lot.',
      en: 'Red grape juice concentrate at 66–69 °Brix, with a dark red to purple colour and a fruity, sweet-tart taste. Its high colour absorbance at 520 nm makes it ideal for beverages, nectars, syrups and fermented drinks, and as a natural source of colour and sweetness. Acidity 1.0–1.8 % (as tartaric acid). Free from fermented or scorched notes — parameters checked for every batch.',
    },
  },
  {
    id: 'pear',
    doc: 'ENF-TS-09', rev: 'Rev. 01',
    group: 'pome', icon: 'pear',
    colors: ['#EFD58A', '#C8963A'],
    slug: { ro: 'concentrat-suc-de-pere', en: 'pear-juice-concentrate' },
    name: { ro: 'Concentrat de suc de pere', en: 'Pear juice concentrate' },
    fruit: { ro: 'Pere', en: 'Pear' },
    brix: '69–71',
    acidity: { value: '0.8–1.8', acid: 'malic' },
    extra: {
      name: { en: '%T at 440 nm / 11.5 °Bx', ro: 'Transmitanța (%T) la 440 nm / 11,5 °Bx' },
      unit: '%T', value: '≥ 35',
    },
    organoleptic: {
      appearance: APPEAR_CLEAR,
      colour: {
        en: 'Light amber to golden yellow, characteristic of concentrated pear juice',
        ro: 'De la chihlimbar deschis la galben-auriu, caracteristică sucului concentrat de pere',
      },
      taste: {
        en: 'Characteristic of concentrated pear juice',
        ro: 'Caracteristice sucului concentrat de pere',
      },
      clarity: CLARITY_CLEAR,
    },
    apps: ['beverages', 'juices', 'dairy', 'bakery', 'fermented', 'colour'],
    desc: {
      ro: 'Concentratul de suc de pere are 69–71 °Brix, o culoare de la chihlimbar deschis la galben-auriu și aroma delicată a perei. Aciditatea scăzută (0,8–1,8%, acid malic) îl face ideal ca îndulcitor natural și ca bază pentru sucuri, nectaruri, preparate din fructe, lactate și cidru de pere. Limpede, cu transmitanță ≥ 35% la 440 nm. Livrat cu fișă tehnică, certificat de analiză și trasabilitate pe lot.',
      en: 'Pear juice concentrate at 69–71 °Brix, with a light amber to golden-yellow colour and the delicate aroma of pears. Its low acidity (0.8–1.8 %, as malic acid) makes it ideal as a natural sweetener and as a base for juices, nectars, fruit preparations, dairy and perry. Clear, with transmittance of ≥ 35 % at 440 nm. Supplied with a technical specification, Certificate of Analysis and batch traceability.',
    },
  },
  {
    id: 'plum',
    doc: 'ENF-TS-10', rev: 'Rev. 01',
    group: 'stone', icon: 'plum',
    colors: ['#8A3A78', '#3A0B33'],
    slug: { ro: 'concentrat-suc-de-prune', en: 'plum-juice-concentrate' },
    name: { ro: 'Concentrat de suc de prune', en: 'Plum juice concentrate' },
    fruit: { ro: 'Prune', en: 'Plum' },
    brix: '64–66',
    acidity: { value: '6.0–8.5', acid: 'citric' },
    extra: {
      name: { en: 'Colour index at 520 nm / 13.2 °Bx', ro: 'Indicele de culoare la 520 nm / 13,2 °Bx' },
      unit: 'AU', value: '≥ 1.0',
    },
    organoleptic: {
      appearance: APPEAR_CLEAR,
      colour: {
        en: 'Dark red to purple, characteristic of concentrated plum juice',
        ro: 'De la roșu închis la violet, caracteristică sucului concentrat de prune',
      },
      taste: {
        en: 'Characteristic of plum, with a typical fruity, sweet-tart taste, free from foreign tastes and odours',
        ro: 'Caracteristice prunelor, cu gust tipic fructat, dulce-acrișor, fără gusturi și mirosuri străine',
      },
      clarity: CLARITY_CLEAR,
    },
    apps: ['beverages', 'dairy', 'bakery', 'syrups', 'fermented'],
    desc: {
      ro: 'Concentrat de suc de prune (64–66 °Brix), cu o culoare de la roșu închis la violet și gust fructat, dulce-acrișor. Este potrivit pentru nectaruri, băuturi răcoritoare, siropuri, umpluturi pentru patiserie și băuturi fermentate din fructe. Aciditate 6,0–8,5% (acid citric), pH ≤ 3,5. Produs în Bucovina, în conformitate cu legislația alimentară a Uniunii Europene, cu fișă tehnică și certificat de analiză pe lot.',
      en: 'Plum juice concentrate (64–66 °Brix) with a dark red to purple colour and a fruity, sweet-tart taste. It suits nectars, soft drinks, syrups, bakery fillings and fermented fruit beverages. Acidity 6.0–8.5 % (as citric acid), pH ≤ 3.5. Made in Bucovina, Romania, in line with EU food law, with a technical specification and a Certificate of Analysis per batch.',
    },
  },
  {
    id: 'blueberry',
    doc: 'ENF-TS-11', rev: 'Rev. 01',
    group: 'berry', icon: 'blueberry',
    colors: ['#5B3F8C', '#22123E'],
    slug: { ro: 'concentrat-suc-de-afine', en: 'blueberry-juice-concentrate' },
    name: { ro: 'Concentrat de suc de afine', en: 'Blueberry juice concentrate' },
    fruit: { ro: 'Afine', en: 'Blueberry' },
    brix: '64–66',
    acidity: { value: '2.0–7.0', acid: 'citric' },
    extra: {
      name: { en: 'Colour ratio (A520/A430) / 10 °Bx', ro: 'Raportul culorii (A520/A430) / 10 °Bx' },
      unit: '—', value: '≥ 1.0',
    },
    organoleptic: {
      appearance: APPEAR_CLEAR,
      colour: {
        en: 'Dark red to purple, characteristic of concentrated blueberry juice',
        ro: 'De la roșu închis la violet, caracteristică sucului concentrat de afine',
      },
      taste: {
        en: 'Characteristic of blueberry, with a typical fruity, sweet-tart taste, free from foreign tastes and odours',
        ro: 'Caracteristice afinelor, cu gust tipic fructat, dulce-acrișor, fără gusturi și mirosuri străine',
      },
      clarity: CLARITY_CLEAR,
    },
    apps: ['beverages', 'dairy', 'bakery', 'icecream', 'syrups', 'colour'],
    desc: {
      ro: 'Concentratul de suc de afine (64–66 °Brix) are o culoare de la roșu închis la violet și gustul fructat, dulce-acrișor, specific afinelor. Este folosit în băuturi și nectaruri, iaurturi și preparate din fructe, înghețată, siropuri și ca sursă naturală de culoare. Aciditate 2,0–7,0% (acid citric) și raport de culoare A520/A430 ≥ 1,0. Ambalare aseptică sau non-aseptică, termen de valabilitate de până la 24 de luni.',
      en: 'Blueberry juice concentrate (64–66 °Brix) has a dark red to purple colour and the fruity, sweet-tart taste typical of blueberries. It is used in beverages and nectars, yoghurts and fruit preparations, ice cream, syrups and as a natural source of colour. Acidity 2.0–7.0 % (as citric acid) and colour ratio A520/A430 ≥ 1.0. Aseptic or non-aseptic packaging, shelf life of up to 24 months.',
    },
  },
  {
    id: 'peach',
    doc: 'ENF-TS-12', rev: 'Rev. 01',
    group: 'stone', icon: 'peach',
    colors: ['#F7B26A', '#DB7432'],
    slug: { ro: 'concentrat-suc-de-piersici', en: 'peach-juice-concentrate' },
    name: { ro: 'Concentrat de suc de piersici', en: 'Peach juice concentrate' },
    fruit: { ro: 'Piersici', en: 'Peach' },
    brix: '64–66',
    acidity: { value: '2.5–7.0', acid: 'citric' },
    extra: {
      name: { en: 'Colour / clarity', ro: 'Culoare / limpiditate' },
      unit: '—', value: { en: 'To be confirmed by laboratory', ro: 'Se confirmă prin analiză de laborator' },
    },
    organoleptic: {
      appearance: APPEAR_VISCOUS,
      colour: {
        en: 'Yellow to amber, characteristic of concentrated peach juice',
        ro: 'De la galben la chihlimbariu, caracteristică sucului concentrat de piersici',
      },
      taste: {
        en: 'Characteristic of peach, with a typical fruity, sweet and slightly acidic taste, free from foreign tastes and odours',
        ro: 'Caracteristice piersicilor, cu gust tipic fructat, dulce și ușor acidulat, fără gusturi și mirosuri străine',
      },
      clarity: CLARITY_CLOUDY,
    },
    apps: ['beverages', 'juices', 'dairy', 'bakery', 'icecream'],
    desc: {
      ro: 'Concentrat de suc de piersici cu 64–66 °Brix, culoare de la galben la chihlimbariu și gust fructat, dulce și ușor acidulat. Ideal pentru nectaruri, băuturi răcoritoare, ceaiuri reci, iaurturi, înghețată și preparate din fructe. Aciditate 2,5–7,0% (acid citric). Poate fi limpede sau ușor tulbure, în funcție de procesul de limpezire. Specificații complete și certificat de analiză pentru fiecare lot.',
      en: 'Peach juice concentrate at 64–66 °Brix, with a yellow to amber colour and a fruity, sweet and slightly tart taste. Ideal for nectars, soft drinks, iced teas, yoghurts, ice cream and fruit preparations. Acidity 2.5–7.0 % (as citric acid). It may be clear or slightly cloudy, depending on the clarification process. Full specifications and a Certificate of Analysis for every batch.',
    },
  },
  {
    id: 'sweet-cherry',
    doc: 'ENF-TS-13', rev: 'Rev. 00',
    group: 'stone', icon: 'cherry',
    colors: ['#D23A55', '#7A0C24'],
    slug: { ro: 'concentrat-suc-de-cirese', en: 'sweet-cherry-juice-concentrate' },
    name: { ro: 'Concentrat de suc de cireșe', en: 'Sweet cherry juice concentrate' },
    fruit: { ro: 'Cireșe', en: 'Sweet cherry' },
    brix: '67–69',
    acidity: { value: '1.5–3.2', acid: 'citric' },
    extra: {
      name: { en: 'Colour index at 520 nm / 14.2 °Bx', ro: 'Indicele de culoare la 520 nm / 14,2 °Bx' },
      unit: 'AU', value: '≥ 6.0',
    },
    organoleptic: {
      appearance: APPEAR_VISCOUS,
      colour: {
        en: 'Red to dark red or red-violet, characteristic of concentrated sweet cherry juice',
        ro: 'De la roșu la roșu închis sau roșu-violet, caracteristică sucului concentrat de cireșe',
      },
      taste: {
        en: 'Characteristic of sweet cherry, with a typical fruity and acidic taste, free from foreign tastes and odours',
        ro: 'Caracteristice cireșelor, cu gust tipic fructat și acidulat, fără gusturi și mirosuri străine',
      },
      clarity: CLARITY_CLOUDY,
    },
    apps: ['beverages', 'dairy', 'bakery', 'icecream', 'syrups'],
    desc: {
      ro: 'Concentratul de suc de cireșe (67–69 °Brix) are o culoare de la roșu închis la roșu-violet și un gust fructat, echilibrat, cu aciditate moderată (1,5–3,2%, acid citric). Se potrivește în băuturi, nectaruri, lactate, înghețată, siropuri și umpluturi pentru patiserie. Indice de culoare ≥ 6,0 AU la 520 nm. Produs 100% din concentrat de suc de cireșe, fără alergeni și fără OMG, cu trasabilitate completă.',
      en: 'Sweet cherry juice concentrate (67–69 °Brix) has a dark red to red-violet colour and a fruity, balanced taste with moderate acidity (1.5–3.2 %, as citric acid). It fits beverages, nectars, dairy, ice cream, syrups and bakery fillings. Colour index ≥ 6.0 AU at 520 nm. 100 % sweet cherry juice concentrate, allergen-free and GMO-free, with full traceability.',
    },
  },
];

// Parameters common to all concentrates (from the technical specifications)
export const common = {
  ph: '≤ 3.5',
  micro: [
    { key: 'yeasts', unit: 'CFU/g or CFU/mL', limit: '≤ 100', method: 'ISO 21527' },
    { key: 'moulds', unit: 'CFU/g or CFU/mL', limit: '≤ 100', method: 'ISO 21527' },
    { key: 'tvc', unit: 'CFU/g or CFU/mL', limit: '≤ 1,000', method: 'ISO 4833-1' },
    { key: 'ecoli', unit: 'CFU/g', limit: 'nd1g', method: 'ISO 16649-2' },
  ],
  shelfLifeMonths: 24,
  storage: { min: 0, max: 10 },
  transport: { min: 0, max: 25 },
};
