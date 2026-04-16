import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SOURCE = "scripts/source-icon.svg";
const OUT = "static/icons";

await fs.mkdir(OUT, { recursive: true });
const svgBuffer = await fs.readFile(SOURCE);
const BG = { r: 14, g: 14, b: 14, alpha: 1 };

const sizes = [
	{ name: "pwa-192x192.png", size: 192, padding: 0 },
	{ name: "pwa-512x512.png", size: 512, padding: 0 },
	{ name: "pwa-maskable-512x512.png", size: 512, padding: 51 },
	{ name: "apple-touch-icon.png", size: 180, padding: 0 },
	{ name: "favicon-32x32.png", size: 32, padding: 0 },
	{ name: "favicon-16x16.png", size: 16, padding: 0 }
];

for (const { name, size, padding } of sizes) {
	const inner = size - padding * 2;
	await sharp(svgBuffer)
		.resize(inner, inner, { fit: "contain", background: BG })
		.extend({ top: padding, bottom: padding, left: padding, right: padding, background: BG })
		.png()
		.toFile(path.join(OUT, name));
	console.log(`OK ${name}`);
}

console.log(`\nAll icons generated in ${OUT}`);
