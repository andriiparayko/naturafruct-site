// Customer reviews shown in the "Ce spun partenerii noștri / What our partners say" block.
//
// Add ONLY real reviews received from customers (EU Directive 2019/2161 prohibits fake reviews).
// Copy each one from its original source (email, Google, Facebook, marketplace, letter) exactly
// and keep proof of the original. The rating summary is calculated automatically.
//
// Fields:
//   name     – reviewer name as given (e.g. "Andrei P.")
//   company  – optional company / role
//   country  – ISO code, e.g. 'RO', 'MD', 'PL', 'DE' (shows a flag)
//   rating   – 1..5
//   date     – 'YYYY-MM-DD'
//   product  – optional product id from products.mjs (e.g. 'apple'), or null
//   lang     – 'ro' | 'en' (language of the text; reviews are shown on both language versions)
//   text     – the review text, unchanged
//   source   – where it was received: 'email' | 'google' | 'facebook' | 'other'
//   sample   – true ONLY for the layout placeholders below. Delete these once real reviews are added.

export default [
  {
    sample: true,
    name: 'Nume Client', company: 'Companie (exemplu)', country: 'RO',
    rating: 5, date: '2026-10-01', product: 'apple', lang: 'ro', source: 'email',
    text: 'Aici va apărea textul unei recenzii reale primite de la un client — copiat exact, fără modificări.',
  },
  {
    sample: true,
    name: 'Client Name', company: 'Company (sample)', country: 'PL',
    rating: 5, date: '2026-09-18', product: 'aronia', lang: 'en', source: 'email',
    text: 'A real customer review will appear here — copied word for word from the original message.',
  },
  {
    sample: true,
    name: 'Nume Client', company: 'Companie (exemplu)', country: 'MD',
    rating: 4, date: '2026-09-02', product: 'sour-cherry', lang: 'ro', source: 'google',
    text: 'Exemplu de recenzie pentru previzualizarea designului. Înlocuiți cu recenzii reale din e-mail, Google sau alte surse.',
  },
];
