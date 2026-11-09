# Paste this into Claude Code (run it from this folder)

Read BRIEF.md and CONTENT.md in this folder, then look at the images in /reference and the files in /assets.

Build a single-page marketing website for AZ Cardominiums, a deeded garage-condo project in Marana, Arizona for car builders, restorers and collectors. The brochure and one-sheeter in /reference are the source of truth for look, feel, content and flow. The website should feel like the same brand, adapted for the web.

Requirements:
1. Plain, fast, static site: one index.html plus CSS and a small amount of vanilla JS. No framework unless you can justify it. Keep it deployable to any static host (Cloudflare Pages, Netlify, Vercel or GitHub Pages).
2. Use the exact copy in CONTENT.md. Do not invent facts, numbers, amenities, dates or events. Anything marked OPEN in CONTENT.md must stay out of the page or appear as a clearly flagged TODO comment in the code, never as made-up text.
3. Follow the design system in BRIEF.md (palette, fonts, stripes, checkered strip, photo framing). Self-host the fonts from /assets/fonts. Optimize images (responsive sizes, WebP/AVIF with JPG fallback, lazy loading, explicit width and height).
4. Mobile first. Most visitors will arrive from the QR code on a phone. Include a sticky bar with Call and Request a Tour buttons on mobile.
5. Include a tour/reservation request form (name, phone, email, interested bay size, message). Wire it to a form service endpoint through a single config value so I can drop in the real one. Include client-side validation, a success state, and a honeypot field for spam. Until the endpoint is set, the form should fall back to a mailto: link to AzCardominiums@gmail.com.
6. SEO and sharing: title, meta description, canonical (https://www.azcardominiums.com), Open Graph and Twitter cards using the builder's shop photo, favicon from the logo, LocalBusiness/RealEstateListing-style JSON-LD with the address and phone, robots.txt and sitemap.xml.
7. Accessibility: semantic HTML, alt text, visible focus states, 4.5:1 contrast on body text, respects prefers-reduced-motion, works without JS except the form submission.
8. Add analytics placeholders (GA4 ID and Google Ads conversion tag) behind clearly named config values, plus events for phone click, email click and form submit. Do not load anything until IDs are filled in.
9. Do not use em dashes anywhere in the copy or code comments.

Process: first propose the page structure and a short build plan, wait for my approval, then build. After building, run it locally, check it at 375px, 768px and 1440px widths, run Lighthouse, and fix anything under 90. Finish with a short README covering how to edit prices and copy, how to set the form endpoint and analytics IDs, and how to deploy.
