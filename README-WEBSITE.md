# AZ Cardominiums website

A single static page. No framework, no build step to deploy. Everything that goes live is in `site/`.

```
site/
  index.html        all copy and the price table
  css/styles.css    design system (colors, fonts, layout)
  js/main.js        tour form + mobile bar (FORM_ENDPOINT lives here)
  img/              optimized photos and logo (generated, see below)
  fonts/            self-hosted Bebas Neue, Barlow, Barlow Condensed
  robots.txt, sitemap.xml, site.webmanifest, favicons, _headers
tools/
  build-images.mjs  regenerates site/img from assets/images
```

## Preview locally

```bash
python3 -m http.server 8080 --directory site
```

Then open http://localhost:8080.

## Edit copy

All copy is plain text in `site/index.html`, in page order. Each section starts with a comment (`<!-- 6. Pick your bay -->` and so on). Keep it matching CONTENT.md, and don't use em dashes.

## Edit prices and bay sizes

Look for the `PRICE TABLE` comment in `site/index.html`. Each row looks like this:

```html
<tr role="row" style="--w:22.5%"><th ...>Size 1</th><td ...>450 sq ft</td><td ...>2</td><td ...>$156,000</td></tr>
```

- Change the text in the cells to change the size, square feet, bay count or price.
- `--w` sets the width of the red bar: square feet divided by 2,000, as a percent (for example 1,200 / 2,000 = 60%).
- If sizes change, update the matching options in the form's "Interested in" dropdown (search for `f-interest`). Also check the meta description and JSON-LD in the `<head>`, which mention the 450 to 2,000 sq ft range.

## Set the form endpoint

Open `site/js/main.js` and fill in the value at the top:

```js
const FORM_ENDPOINT = 'https://formspree.io/f/yourFormId';
```

This works with any service that accepts a standard form POST and returns JSON (Formspree, Basin, Getform and others). While it's empty, submitting opens the visitor's email app with a prefilled message to AzCardominiums@gmail.com. Without JavaScript, the form posts to a `mailto:` link.

The form includes a hidden honeypot field named `company`. Submissions that fill it in are dropped quietly.

## Update photos

1. Put new originals in `assets/images/` using the same filenames.
2. Regenerate the optimized versions:
   ```bash
   cd tools && npm install && npm run images
   ```
3. If a photo's dimensions change, update the `width`/`height` attributes and the largest `srcset` width in `index.html`.

## Deploy

The publish directory is `site/`, and there's no build command.

- **Cloudflare Pages / Netlify:** create a project, set the output/publish directory to `site`, and leave the build command empty. `_headers` sets long cache times for fonts and images.
- **Vercel:** import the folder, choose framework "Other", set the output directory to `site`, and leave the build command empty.
- **GitHub Pages:** publish the contents of `site/` from a branch (or copy them to the repo root or `/docs`).

Then point `www.azcardominiums.com` at the host and redirect the bare domain to `www` so it matches the canonical URL.

## Open items before launch (from CONTENT.md)

These are marked `TODO (OPEN item N)` in the code.

1. Legal and disclosure language: counsel to confirm. There's an empty `.legal-disclosures` slot in the footer.
2. Deposit amount and terms: not published.
3. HOA dues, taxes, utilities: not published.
4. Electrical capacity: not stated, to be confirmed with the City of Marana.
5. Vector logo: swap the PNG for an SVG when it's available (header, footer and favicons).
6. Higher resolution photos: current originals are about 1,400 px wide.
7. Form endpoint (above), Search Console and Business Profile.
8. Hosting and DNS.
9. Privacy policy page: link it in the footer (needed for the form).
