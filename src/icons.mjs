// Inline SVG icons. Fruit icons: 64×64 line art (stroke = currentColor). UI icons: 24×24.

const fruitPaths = {
  apple: `<path d="M32 20c-4-3-10-4-14-1-5 4-6 12-3 20 3 8 8 14 12 14 2 0 3-1 5-1s3 1 5 1c4 0 9-6 12-14 3-8 2-16-3-20-4-3-10-2-14 1z"/><path d="M32 20c0-5 1-9 4-12"/><path d="M35 14c3-4 8-5 12-4-1 4-6 7-12 4z"/>`,
  pear: `<path d="M32 16c-4 0-6 3-6 7 0 4-2 6-5 10-3 4-4 8-3 12 1 6 7 10 14 10s13-4 14-10c1-4 0-8-3-12-3-4-5-6-5-10 0-4-2-7-6-7z"/><path d="M32 16c0-4 1-7 3-9"/><path d="M34 11c3-3 7-3 10-1-2 3-7 4-10 1z"/>`,
  cherry: `<circle cx="21" cy="45" r="9"/><circle cx="43" cy="47" r="9"/><path d="M21 36c2-10 8-18 19-24"/><path d="M43 38c-1-9-2-17-3-26"/><path d="M40 12c4-4 10-4 15-1-4 5-11 5-15 1z"/>`,
  grape: `<circle cx="22" cy="25" r="6"/><circle cx="34" cy="25" r="6"/><circle cx="46" cy="25" r="6"/><circle cx="28" cy="36" r="6"/><circle cx="40" cy="36" r="6"/><circle cx="34" cy="47" r="6"/><path d="M34 19v-9"/><path d="M34 13c4-4 10-4 14 0-4 4-10 4-14 0z"/>`,
  strawberry: `<path d="M32 56c-8-4-16-14-16-24 0-6 5-10 10-10 3 0 5 1 6 2 1-1 3-2 6-2 5 0 10 4 10 10 0 10-8 20-16 24z"/><path d="M23 19l5 4 4-6 4 6 5-4"/><path d="M32 17v-7"/><g fill="currentColor" stroke="none"><circle cx="26" cy="31" r="1.3"/><circle cx="38" cy="31" r="1.3"/><circle cx="32" cy="37" r="1.3"/><circle cx="26" cy="43" r="1.3"/><circle cx="38" cy="43" r="1.3"/><circle cx="32" cy="49" r="1.3"/></g>`,
  raspberry: `<path d="M18 31c0-8 6-12 14-12s14 4 14 12c0 12-7 22-14 22S18 43 18 31z"/><circle cx="26" cy="29" r="3.2"/><circle cx="32" cy="27" r="3.2"/><circle cx="38" cy="29" r="3.2"/><circle cx="24" cy="37" r="3.2"/><circle cx="31" cy="36" r="3.2"/><circle cx="38" cy="37" r="3.2"/><circle cx="27" cy="44" r="3.2"/><circle cx="35" cy="44" r="3.2"/><path d="M24 19c2-4 5-6 8-6s6 2 8 6"/><path d="M32 13V7"/>`,
  currant: `<path d="M12 10c12 2 22 10 30 24"/><path d="M22 14v13"/><circle cx="22" cy="33" r="6"/><path d="M32 21l2 13"/><circle cx="35" cy="40" r="6"/><path d="M40 29l6 13"/><circle cx="47" cy="48" r="6"/><path d="M12 10c-1 6 2 11 8 12 1-6-2-11-8-12z"/>`,
  aronia: `<circle cx="23" cy="41" r="7.5"/><circle cx="39" cy="43" r="7.5"/><circle cx="31" cy="29" r="7.5"/><path d="M31 21.5V11"/><path d="M31 14c-6-6-14-5-18-1 5 4 13 5 18 1z"/><g fill="currentColor" stroke="none"><circle cx="23" cy="41" r="1.4"/><circle cx="39" cy="43" r="1.4"/><circle cx="31" cy="29" r="1.4"/></g>`,
  blueberry: `<circle cx="26" cy="39" r="12"/><circle cx="45" cy="31" r="9"/><path d="M22.5 39h7M26 35.5v7"/><path d="M42 31h6M45 28v6"/><path d="M45 22c1-6 7-10 13-9-1 6-7 10-13 9z"/>`,
  plum: `<path d="M32 18c-10 0-17 9-17 20s7 18 17 18 17-7 17-18-7-20-17-20z"/><path d="M32 22c-4 8-4 22 0 32"/><path d="M32 18c0-4 2-8 5-10"/><path d="M36 11c4-3 9-3 12 0-3 4-9 4-12 0z"/>`,
  peach: `<path d="M32 20c-4-3-9-3-13 0-6 4-8 12-5 21 3 8 10 14 18 14s15-6 18-14c3-9 1-17-5-21-4-3-9-3-13 0z"/><path d="M32 22c4 8 4 22-2 32"/><path d="M32 20c-1-5-4-8-10-9 0 5 4 9 10 9z"/>`,
  // Placeholder icons for upcoming categories
  bottle: `<path d="M27 8h10v8l4 6v30a4 4 0 0 1-4 4H27a4 4 0 0 1-4-4V22l4-6z"/><path d="M23 32h18"/><path d="M23 44h18"/>`,
  tea: `<path d="M14 26h30v12a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12z"/><path d="M44 30h4a5 5 0 0 1 0 10h-5"/><path d="M24 10c-2 3 2 5 0 8M32 10c-2 3 2 5 0 8"/><path d="M12 56h36"/>`,
};

export function fruitIcon(name, cls = '') {
  return `<svg class="${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${fruitPaths[name] || fruitPaths.apple}</svg>`;
}

const ui = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l8-8"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
  trace: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9v6M10 9v6M13 9v6M16.5 9v6"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  building: '<path d="M4 21V8l6-4v17M10 21h10V10l-10-3"/><path d="M14 13h2M14 17h2M6.5 11h1M6.5 15h1"/>',
  thermo: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 10v6"/>',
  truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  box: '<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  factory: '<path d="M3 21V11l5 3V11l5 3V8l8 4v9z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  apple: '<path d="M12 7.5c-1.5-1.2-4-1.5-5.5-.3C4.6 8.7 4.3 12 5.5 15c1.1 3 3 5 4.5 5 .8 0 1.2-.4 2-.4s1.2.4 2 .4c1.5 0 3.4-2 4.5-5 1.2-3 .9-6.3-1-7.8-1.5-1.2-4-.9-5.5.3z"/><path d="M12 7.5c0-2 .5-3.4 1.6-4.5"/>',
  print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  // applications
  beverages: '<path d="M7 3h10l-1.5 17a1.5 1.5 0 0 1-1.5 1.4H10a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M7.6 9h8.8"/><path d="M14 3l2-2"/>',
  juices: '<path d="M8 8l2-5h4l2 5v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/><path d="M8 8h8M10.5 13.5a1.5 1.5 0 0 0 3 0c0-1-1.5-2.5-1.5-2.5s-1.5 1.5-1.5 2.5z"/>',
  dairy: '<path d="M5 9h14l-1.5 11a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1z"/><path d="M4 6h16v3H4zM9 13c1 1 5 1 6 0"/>',
  bakery: '<path d="M4 15a8 6 0 0 1 16 0v3H4z"/><path d="M8 11.5l1.5 3M12 10v4.5M16 11.5l-1.5 3M3 18h18"/>',
  icecream: '<path d="M8 11l4 10 4-10"/><path d="M7 11a5 5 0 1 1 10 0z"/>',
  syrups: '<path d="M10 3h4v4l2 3v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10l2-3z"/><path d="M8 13h8"/>',
  fermented: '<path d="M7 3h10v5a5 5 0 0 1-10 0z"/><path d="M12 13v8M8.5 21h7M7 6h10"/>',
  colour: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-2 0-1.4-1-1.7-1-2.8 0-.9.7-1.4 1.6-1.4H17a4 4 0 0 0 4-4c0-4.4-4-7.8-9-7.8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>',
};

export function icon(name, cls = '', size = 24) {
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ui[name] || ''}</svg>`;
}

export const whatsappIcon = `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
