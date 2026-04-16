---
phase: "1"
plan: "03-03"
name: "generate-qr"
wave: 3
requires:
  - "01-01"
  - "02-05"
req_ids:
  - QR-01
status: pending
autonomous: true
---

## Objective
Создать `scripts/generate-qr.js` — CLI-скрипт, принимающий `--tables N --base URL --output DIR` и выдающий набор PNG-файлов (`table-01.png`...) + `tables.pdf` с сеткой 2×3 для печати. Прогнать скрипт для 10 столов с base `https://kokolsk1y.github.io/table-mind/` → проверить что выход появился в `qr-output/`.

## Context
Решение из CONTEXT.md «Стратегия генерации QR-кодов»: build-time скрипт, запускается локально разработчиком под каждого клиента. Зависимости `qrcode` и `pdfkit` уже добавлены в `package.json` в 01-01 → после `npm install` (уже сделано в 03-02) доступны.

Ограничения:
- `qr-output/` — в `.gitignore` (01-01), файлы не коммитятся — это per-restaurant артефакт
- Кириллица в PDFKit не работает без подключения шрифта — используем английское «Table N» (RESEARCH.md Open Question #2 — Phase 1 использует английское)
- Сетка 2×3 на A4 (595×842 pt, margin 36) → 6 QR на страницу, 10 столов = 2 страницы
- Цвета QR: `dark: "#0e0e0e"`, `light: "#ffffff"` — совпадает с темой (Pitfall #9)
- Error correction level `M` — баланс размера и устойчивости

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Code Examples → scripts/generate-qr.js** (готовый код)
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Pitfalls #9, #10**

## Tasks

### Task 03-03-01 — scripts/generate-qr.js
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\scripts\generate-qr.js`
- **How:** дословно из RESEARCH.md раздел «Code Examples → scripts/generate-qr.js» (табы, двойные кавычки, ESM):
	- Импорты: `QRCode` из `"qrcode"`, `PDFDocument` из `"pdfkit"`, `fs` из `"node:fs/promises"`, `createWriteStream` из `"node:fs"`, `path` из `"node:path"`
	- `parseArgs()`: по умолчанию `tables=10`, `base="https://kokolsk1y.github.io/table-mind/"`, `output="./qr-output"`; парсит флаги `--tables`, `--base`, `--output`
	- `main()`:
		1. `await fs.mkdir(output, { recursive: true });`
		2. Цикл `for (let i = 1; i <= tables; i++)`:
			- `url = base + "?table=" + i`
			- `fname = "table-" + String(i).padStart(2, "0") + ".png"`
			- `buf = await QRCode.toBuffer(url, { type: "png", errorCorrectionLevel: "M", margin: 2, width: 512, color: { dark: "#0e0e0e", light: "#ffffff" } })`
			- `await fs.writeFile(path.join(output, fname), buf);`
			- `buffers.push({ buf, num: i });`
			- `console.log("OK " + fname + " -> " + url);`
		3. Сборка PDF:
			- `const doc = new PDFDocument({ size: "A4", margin: 36 });`
			- `doc.pipe(createWriteStream(path.join(output, "tables.pdf")));`
			- Константы страницы: `PAGE_W=595, PAGE_H=842, MARGIN=36, COLS=2, ROWS=3`
			- `CELL_W = (PAGE_W - MARGIN*2) / COLS`, `CELL_H = (PAGE_H - MARGIN*2) / ROWS`
			- `QR_SIZE = Math.min(CELL_W, CELL_H) - 40`
			- Цикл по `buffers`: `idx = i % 6`, при `i>0 && idx===0` → `doc.addPage()`; вычислить `col`, `row`, `x`, `y`; `doc.image(item.buf, x, y, { width: QR_SIZE })`; `doc.fontSize(16).text("Table " + item.num, ...)` — английское, без кириллицы
			- `doc.end();`
		4. `console.log("Generated " + tables + " QR codes + tables.pdf in " + output);`
	- В конце: `main().catch((e) => { console.error(e); process.exit(1); });`
- **Done when:** файл существует, содержит `QRCode.toBuffer`, `PDFDocument`, `errorCorrectionLevel: "M"`, `dark: "#0e0e0e"`, `Table " + item.num`

### Task 03-03-02 — Прогон скрипта для демо
- **What:** Сгенерировать 10 демо-QR
- **How:** `cd c:/Users/ikoko/Projects/table-mind && node scripts/generate-qr.js --tables 10 --base https://kokolsk1y.github.io/table-mind/ --output ./qr-output`
- **Done when:** в `qr-output/` появились 10 PNG + `tables.pdf`

### Task 03-03-03 — Валидация содержимого QR (опционально, но желательно)
- **What:** Проверить что первый PNG реально содержит ссылку с `?table=1`
- **How:** создать крошечный скрипт или вызвать `node -e` с `qrcode-reader` (не обязательно устанавливать). Альтернативно — пропустить автоматическую проверку, полагаясь на корректность библиотеки `qrcode`
- **Done when:** (опционально) `node scripts/check-qr.js qr-output/table-01.png` возвращает URL с `?table=1`; либо визуальная проверка сканером (человек, позже)
- **Note:** Автоматическая проверка не обязательна — достаточно убедиться что файлы созданы и ненулевого размера

## Tests Required
- `test -f scripts/generate-qr.js`
- `grep -q 'import QRCode from "qrcode"' scripts/generate-qr.js`
- `grep -q 'import PDFDocument from "pdfkit"' scripts/generate-qr.js`
- `grep -q '"--tables"' scripts/generate-qr.js`
- `grep -q '"--base"' scripts/generate-qr.js`
- `grep -q '"--output"' scripts/generate-qr.js`
- `grep -q 'errorCorrectionLevel: "M"' scripts/generate-qr.js`
- `grep -q 'dark: "#0e0e0e"' scripts/generate-qr.js`
- `grep -q 'size: "A4"' scripts/generate-qr.js`
- `grep -qE 'Table (" \+ item\.num|\$\{item\.num\})' scripts/generate-qr.js`
- `test -f qr-output/table-01.png && test -s qr-output/table-01.png`
- `test -f qr-output/table-10.png && test -s qr-output/table-10.png`
- `test -f qr-output/tables.pdf && test -s qr-output/tables.pdf`
- `node --input-type=commonjs -e "const s=require('fs').statSync('qr-output/tables.pdf'); process.exit(s.size>5000?0:1)"` — PDF больше 5KB
- `git check-ignore qr-output/table-01.png; test $? -eq 0` — файл В игноре (не коммитится)

## Definition of Done
- [ ] `scripts/generate-qr.js` создан по образцу из RESEARCH.md
- [ ] Поддерживает CLI-аргументы `--tables`, `--base`, `--output`
- [ ] Цвета QR совпадают с темой (`#0e0e0e` / `#ffffff`)
- [ ] Использует английское «Table N» (обход pitfall с кириллицей в PDFKit)
- [ ] Прогон для 10 столов успешно создаёт 10 PNG + tables.pdf в `qr-output/`
- [ ] `qr-output/` игнорируется git-ом
- [ ] Все grep- и test-проверки проходят
