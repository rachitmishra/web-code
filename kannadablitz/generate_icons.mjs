import { writeFileSync } from "node:fs";
import { Jimp } from "jimp";

const SRC = process.argv[2] || "/home/rachit/.gemini/antigravity-cli/brain/b7375d10-bed2-4e19-a124-f92d3455cc78/namma_kannada_icon_1795597059693.jpg";
const TARGETS = [
  { file: "public/apple-touch-icon.png", size: 180 },
  { file: "public/favicon-96x96.png", size: 96 },
  { file: "public/web-app-manifest-192x192.png", size: 192 },
  { file: "public/web-app-manifest-512x512.png", size: 512 },
];

// Flat Kannada arishina yellow (#F2B705) with a subtle warm drop shadow on a 100% transparent background.
const GLYPH_R = 0xf2;
const GLYPH_G = 0xb7;
const GLYPH_B = 0x05;

const SHADOW_R = 0x3b;
const SHADOW_G = 0x12;
const SHADOW_B = 0x14;
const SHADOW_ALPHA = 0.34;

/** Wrap one or more PNG buffers into a standard .ico file. */
function buildIco(entries) {
  const header = Buffer.alloc(6 + entries.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = header.length;
  for (let i = 0; i < entries.length; i++) {
    const { size, png } = entries[i];
    const base = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, base);
    header.writeUInt8(size >= 256 ? 0 : size, base + 1);
    header.writeUInt8(0, base + 2);
    header.writeUInt8(0, base + 3);
    header.writeUInt16LE(1, base + 4);
    header.writeUInt16LE(32, base + 6);
    header.writeUInt32LE(png.length, base + 8);
    header.writeUInt32LE(offset, base + 12);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries.map((e) => e.png)]);
}

const raw = await Jimp.read(SRC);
const w = raw.width;
const h = raw.height;
const data = raw.bitmap.data;

let minX = w, minY = h, maxX = 0, maxY = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = (y * w + x) * 4;
    const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    let alpha = 0;
    if (lum <= 155) alpha = 255;
    else if (lum < 232) alpha = Math.round(((232 - lum) / (232 - 155)) * 255);
    data[idx] = GLYPH_R;
    data[idx + 1] = GLYPH_G;
    data[idx + 2] = GLYPH_B;
    data[idx + 3] = alpha;
    if (alpha > 16) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const bw = maxX - minX + 1;
const bh = maxY - minY + 1;
const glyph = raw.clone().crop({ x: minX, y: minY, w: bw, h: bh });
const CANVAS = 1024;
const maxDim = Math.round(CANVAS * 0.58);
const scale = maxDim / Math.max(bw, bh);
const nw = Math.round(bw * scale);
const nh = Math.round(bh * scale);
glyph.resize({ w: nw, h: nh });

const gx = Math.round((CANVAS - nw) / 2);
const gy = Math.round((CANVAS - nh) / 2);

// Build subtle soft drop shadow layer underneath the yellow glyph
const shadowGlyph = glyph.clone();
const sd = shadowGlyph.bitmap.data;
for (let i = 0; i < sd.length; i += 4) {
  sd[i] = SHADOW_R;
  sd[i + 1] = SHADOW_G;
  sd[i + 2] = SHADOW_B;
  sd[i + 3] = Math.round(sd[i + 3] * SHADOW_ALPHA);
}

const master = new Jimp({ width: CANVAS, height: CANVAS, color: 0x00000000 });
master.composite(shadowGlyph, gx, gy + 18);
master.blur(14);
master.composite(glyph, gx, gy);

for (const { file, size } of TARGETS) {
  const img = master.clone().resize({ w: size, h: size });
  await img.write(file);
  console.log(`Wrote ${file} (${size}x${size}, yellow glyph + soft shadow, transparent RGBA)`);
}

const icoEntries = [];
for (const size of [32, 48]) {
  const png = await master.clone().resize({ w: size, h: size }).getBuffer("image/png");
  icoEntries.push({ size, png });
}
writeFileSync("public/favicon.ico", buildIco(icoEntries));
console.log("Wrote public/favicon.ico (32x32, 48x48)");
