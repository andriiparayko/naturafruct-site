# NaturaFruct — сайт (RO основна / EN додаткова)

B2B-сайт виробника концентрованих соків EKO NATURA FRUCT S.R.L.
Статичний HTML (максимальна швидкість і SEO) + один PHP-файл для форми зворотного зв'язку.

## Структура

```
build.mjs              генератор сайту → dist/
dev-server.mjs         локальний перегляд + імітація відправки форми
src/config.mjs         домен, контакти, телефони, WhatsApp, координати карти
src/i18n/ro.mjs        усі тексти румунською (мета-теги, сторінки, FAQ, форма, політика)
src/i18n/en.mjs        те саме англійською
src/data/products.mjs  13 концентратів + техспеки (з ENF-TS-01…13)
src/data/reviews.mjs   відгуки (зараз 3 зразки-заглушки)
src/assets/            css, js, шрифти (локально, GDPR), фото, Leaflet, PDF
src/php/               contact.php + contact-config.php (пошта, SMTP, антиспам)
src/htaccess.txt       шаблон .htaccess (HTTPS, www, 301 зі старого сайту, кеш, безпека)
```

## Збірка й перегляд

Потрібен лише Node.js 18+ (без npm-пакетів).

```bash
node build.mjs
```

```bash
node dev-server.mjs
```

Відкрити http://localhost:8080 (англійська — http://localhost:8080/en/).

## Як редагувати

| Що змінити | Де |
|---|---|
| Тексти, заголовки, мета-описи, FAQ | `src/i18n/ro.mjs`, `src/i18n/en.mjs` |
| Продукти, характеристики, описи | `src/data/products.mjs` |
| Фото продукту | покласти `src/assets/img/products/<id>.webp` (800×600) і додати `image: '/assets/img/products/<id>.webp'` у продукт |
| PDF техспеки | `src/assets/docs/…pdf` + поле `pdf` у продукті (зараз є лише для яблука) |
| Відгуки | `src/data/reviews.mjs` — тільки реальні; 3 зразки видалити |
| Телефони, e-mail, WhatsApp, адреса, координати | `src/config.mjs` |
| Куди приходять листи з форми, SMTP | `src/php/contact-config.php` |

Після будь-яких змін — `node build.mjs` і завантажити `dist/` на хостинг.

## Деплой (Apache + PHP 7.4+)

1. `node build.mjs`
2. Завантажити **весь вміст** папки `dist/` (разом із прихованим `.htaccess`) у корінь сайту (`public_html`).
3. Створити поштову скриньку `no-reply@naturafruct.ro` і вписати SMTP-доступ у `contact-config.php` (рекомендовано — інакше листи через `mail()` часто йдуть у спам).
4. Перевірити SPF/DKIM для домену naturafruct.ro у панелі хостингу.
5. Надіслати тестову заявку з `/contact/`.
6. Google Search Console: додати домен, надіслати `https://www.naturafruct.ro/sitemap.xml`.

Канонічний домен — `https://www.naturafruct.ro` (як на старому сайті). Якщо потрібен без `www`, змінити `siteUrl` у `src/config.mjs` і блок редиректу в `src/htaccess.txt`.

### Антиспам форми
- приховане поле-пастка (honeypot), мінімальний час заповнення, JS-токен взаємодії;
- ліміт 5 повідомлень на годину з однієї IP, ліміт посилань у тексті, захист від підміни заголовків;
- опційно Cloudflare Turnstile (безкоштовно, без «знайди світлофори»): ключ сайту в `src/config.mjs`, секрет — у `contact-config.php`.

### SEO
- окремі URL для кожної мови та кожного з 13 продуктів (модальне вікно на сайті відкриває ту саму сторінку);
- `hreflang` ro/en/x-default, canonical, Open Graph, `sitemap.xml` з альтернативами, `robots.txt`;
- schema.org: Organization (юр. дані, контакти), BreadcrumbList, FAQPage, ItemList;
- 301-редиректи зі старих адрес Joomla (`/ro/despre-noi`, `/ro/fabrica-si-utilaje`, `/en/factory-and-equipment` …).

## Перед запуском перевірити

- [ ] Замінити 3 зразки відгуків реальними (`src/data/reviews.mjs`).
- [ ] Факти історії: 2009 — заснування, 2013 — фабрика з німецьким обладнанням (взято зі старого сайту).
- [ ] Номер WhatsApp (зараз 0799 111 003).
- [ ] Точку на карті (зараз центр с. Корлата; за потреби вписати точні координати будівлі в `src/config.mjs`).
- [ ] Політику конфіденційності (шаблон GDPR — бажано показати юристу; термін зберігання 3 роки).
- [ ] Чи можна публікувати номер документа техспеки (ENF-TS-xx) і PDF яблучного концентрату.
