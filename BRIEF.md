# AZ Cardominiums: Website Brief

## What this is
AZ Cardominiums is a deeded garage-condo project in Marana, Arizona (18 bays, 20 ft ceilings, 450 to 2,000 sq ft). It is aimed at car builders, restorers, collectors and weekend racers who want a real shop they own, and who are not just looking for storage. Storage buyers are welcome but are not the focus. The brand and community are built around hobbyist builders and collectors.

Owners: Sam Locke and his father. Sam runs Good Juju Agency (goodjujuagency.com) and will manage ads and tracking for this site.

## Goal of the site
Turn a QR scan, ad click or word-of-mouth visit into a phone call, a tour request or a reservation conversation. One page, one primary action: request a tour or call 520-247-6644.

## Audience
Hobbyist and serious car people in the Tucson and Marana area: builders, restorers, collectors, track-day and weekend racers, and "man cave dreamers" who want a hangout with a roll-up door. Tone is confident, warm, a little wry (shop humor), never corporate real-estate speak.

## Brand and design system
Retro garage and hot rod, matching the brochure and one-sheeter in /reference.

Palette
- Cream  #F2E8D0 (main light color, text on dark)
- Paper  #E6D8B4 (secondary light panels)
- Red    #C62828 (accent, banners, icons)
- Charcoal #1C1C1C (main dark background, text on light)
- Mustard #E6A817 (highlight words, labels, frames)
Note: the background is warm charcoal, not blue.

Fonts (self-host the woff2 files in /assets/fonts)
- Bebas Neue 400: all big headlines, prices, numerals
- Barlow Condensed 600/700: small uppercase labels with wide letter spacing (about .14em)
- Barlow 400/600/700: body copy

Motifs
- Top of page: thin double stripe, red then cream.
- Bottom of page: black and cream checkered strip.
- Photos: 3px mustard frame, no rounded corners beyond 4 to 6px.
- Section label pattern: tiny mustard uppercase label above a large Bebas heading.
- Price table: cream card, charcoal header row, proportional red-tint bars behind each row showing relative square footage.
- Feature icons: simple line icons in red or mustard (bolt, lift, snowflake, drop, grate, lock, deed).
- Highlight one word per headline in mustard (for example "BUILD.").
- Dark sections alternate with cream sections.

Logo: /assets/images/logo-cream-transparent.png (for dark backgrounds). The original is white on black. Request a vector (SVG) version of the logo from the owner for crisp use at large sizes. The raster is about 1255 px wide.

## Page structure (single page, in this order)
1. Top stripe and header: logo left, "Now reserving, Marana AZ" and phone number right. Sticky mobile bar with Call and Request a Tour.
2. Hero: headline "BUILT FOR THE ONES WHO BUILD.", subhead, large builder's shop photo (car on the lift), primary buttons (Request a Tour, Call). 
3. Why a Cardominium: intro paragraph plus the three stat tiles (18 deeded bays, 20' ceilings, 450 sq ft and up).
4. Built for: the five audience bullets and the closing line.
5. Built to be built out: six feature rows with icons plus the Available Options box.
6. Picture it: complex aerial, upscale bay, builder's shop. Use captions only if they help, since the brochure intentionally has none.
7. Pick your bay: seven-size price table (intro prices), Mega Garages callout, intro-pricing note.
8. Own it, don't rent it: red banner section.
9. Community: "Potential community events" with Cars & Coffee, Car Show, Community Cruise Nights. These are a vision only, not scheduled events. Do not word them as planned or announced.
10. How it works: Book a shop tour, Pick your bay and floor plan, Reserve with a deposit.
11. Request a tour form plus contact block (phone, email, address, Google Map embed or link) and the QR is not needed on the site.
12. Footer: logo, contact, copyright, and a placeholder for legal disclosures (see OPEN items). Checkered strip.

## Technical requirements
See PROMPT.md. Static, fast, mobile first, accessible, SEO and Open Graph complete, analytics hooks off until IDs are supplied.

## Conversion tracking notes (for the owner's ad setup)
Track as separate events: tel: link click, mailto: link click, form submit, and scroll to the price table. Keep event names clean (phone_click, email_click, form_submit, view_pricing) so they map to Google Ads conversions.

## Things not to do
- No em dashes anywhere.
- Do not state electrical amperage or service size. Capacity depends on what the City of Marana permits and is "to be confirmed."
- Do not say events are planned. They are potential events.
- Do not publish HOA dues, taxes, utilities or deposit amounts. They are not set.
- Do not publish internal pricing strategy. Prices are introductory and may change. Do not promise that they will go up or when.
- Do not fabricate testimonials, reviews, timelines, completion dates, or "units remaining" counters.
- Do not use stock photos of other buildings.
