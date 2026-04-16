import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";

function parseArgs() {
	const args = process.argv.slice(2);
	const out = { tables: 10, base: "https://kokolsk1y.github.io/table-mind/", output: "./qr-output" };
	for (let i = 0; i < args.length; i++) {
		if (args[i] === "--tables") out.tables = parseInt(args[++i], 10);
		else if (args[i] === "--base") out.base = args[++i];
		else if (args[i] === "--output") out.output = args[++i];
	}
	return out;
}

async function main() {
	const { tables, base, output } = parseArgs();
	await fs.mkdir(output, { recursive: true });

	const buffers = [];
	for (let i = 1; i <= tables; i++) {
		const url = `${base}?table=${i}`;
		const fname = `table-${String(i).padStart(2, "0")}.png`;
		const buf = await QRCode.toBuffer(url, {
			type: "png",
			errorCorrectionLevel: "M",
			margin: 2,
			width: 512,
			color: { dark: "#0e0e0e", light: "#ffffff" }
		});
		await fs.writeFile(path.join(output, fname), buf);
		buffers.push({ buf, num: i });
		console.log(`OK ${fname} -> ${url}`);
	}

	const doc = new PDFDocument({ size: "A4", margin: 36 });
	doc.pipe(createWriteStream(path.join(output, "tables.pdf")));

	const PAGE_W = 595, PAGE_H = 842, MARGIN = 36;
	const COLS = 2, ROWS = 3;
	const CELL_W = (PAGE_W - MARGIN * 2) / COLS;
	const CELL_H = (PAGE_H - MARGIN * 2) / ROWS;
	const QR_SIZE = Math.min(CELL_W, CELL_H) - 40;

	buffers.forEach((item, i) => {
		const idx = i % (COLS * ROWS);
		if (i > 0 && idx === 0) doc.addPage();
		const col = idx % COLS;
		const row = Math.floor(idx / COLS);
		const x = MARGIN + col * CELL_W + (CELL_W - QR_SIZE) / 2;
		const y = MARGIN + row * CELL_H + 10;
		doc.image(item.buf, x, y, { width: QR_SIZE });
		doc.fontSize(16).text(`Table ${item.num}`, MARGIN + col * CELL_W, y + QR_SIZE + 8, {
			width: CELL_W,
			align: "center"
		});
	});
	doc.end();
	console.log(`\nGenerated ${tables} QR codes + tables.pdf in ${output}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
