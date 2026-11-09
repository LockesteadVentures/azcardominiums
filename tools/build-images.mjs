// Generates optimized images for the site from ../assets/images.
// Run once (or whenever source photos change): cd tools && npm install && npm run images
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, '../assets/images');
const OUT = path.resolve(here, '../site/img');
await mkdir(OUT, { recursive: true });

const CHARCOAL = { r: 28, g: 28, b: 28, alpha: 1 };

// Photos: AVIF, WebP and JPG at several widths (never upscaled past the original).
// TODO (OPEN item 6): swap in higher resolution originals or final renderings when available.
const photos = [
  { file: 'builders-shop.jpg', name: 'builders-shop', widths: [480, 800, 1360] },
  { file: 'upscale-bay.jpg', name: 'upscale-bay', widths: [480, 800, 1360] },
  { file: 'complex-aerial.jpg', name: 'complex-aerial', widths: [480, 800, 1422] },
];

for (const p of photos) {
  const input = path.join(SRC, p.file);
  for (const w of p.widths) {
    const base = sharp(input).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 50, effort: 6 }).toFile(path.join(OUT, `${p.name}-${w}.avif`));
    await base.clone().webp({ quality: 74 }).toFile(path.join(OUT, `${p.name}-${w}.webp`));
    await base.clone().jpeg({ quality: 78, progressive: true, mozjpeg: true }).toFile(path.join(OUT, `${p.name}-${w}.jpg`));
  }
}

// Open Graph / Twitter card image: 1200x630 crop of the builder's shop.
await sharp(path.join(SRC, 'builders-shop.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(OUT, 'og-builders-shop.jpg'));

// Logo (cream on transparent) for dark backgrounds.
// TODO (OPEN item 5): replace with an SVG of the corrected logo when the owner supplies it.
const logo = path.join(SRC, 'logo-cream-transparent.png');
for (const w of [320, 640]) {

  await sharp(logo).resize({ width: w }).png({ compressionLevel: 9, palette: true }).toFile(path.join(OUT, `logo-${w}.png`));
}

// Favicons: the logo centered on a charcoal square.
async function icon(size, file, pad = 0.08) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(logo).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: CHARCOAL } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, '..', file));
}
await icon(32, 'favicon-32.png', 0.02);
await icon(180, 'apple-touch-icon.png');
await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');

// favicon.ico with an embedded 32px PNG (valid ICO format, supported by all modern browsers).
const png32 = await sharp(path.join(OUT, '..', 'favicon-32.png')).toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14); // image size
header.writeUInt32LE(22, 18); // offset
await writeFile(path.join(OUT, '..', 'favicon.ico'), Buffer.concat([header, png32]));

console.log('Images written to', OUT);
