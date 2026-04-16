---
phase: "1"
plan: "03-02"
name: "generate-icons"
wave: 3
requires:
  - "01-01"
  - "01-03"
  - "02-02"
req_ids:
  - PWA-01
  - PWA-02
status: pending
autonomous: true
---

## Objective
Создать `scripts/generate-icons.js` (sharp-based), запустить его с источником `scripts/source-icon.svg` → получить набор иконок в `static/icons/` (pwa-192, pwa-512, pwa-maskable-512 с 10% safe-area padding, apple-touch-icon 180, favicon-16/32). Иконки коммитятся в репо.

## Context
Почему иконки коммитятся (RESEARCH.md «Potential Conflicts» → Icon generation): GitHub Actions не должен тянуть `sharp` при каждом деплое — это тяжёлая зависимость с нативным бинарником. Скрипт запускается локально один раз, результат коммитится в `static/icons/`.

Maskable icon требует 10% safe-area с каждой стороны (512 → inner 410 → padding 51). Sharp делает это через `.resize(inner, inner, { fit: "contain", background: BG })` + `.extend({ top, bottom, left, right, background: BG })`.

Фоновый цвет — `#0e0e0e` (как у темы), альфа 1.

Этот плагин включает **фактический прогон скрипта** — executor должен вызвать `npm install` и `node scripts/generate-icons.js`, чтобы в `static/icons/` появились файлы. Без этого VitePWA на этапе билда в Wave 2 (и при деплое) будет ругаться на отсутствующие иконки, а Lighthouse PWA score будет < 90.

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Code Examples → scripts/generate-icons.js** (готовый код)
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Pitfalls #4, #11**

## Tasks

### Task 03-02-01 — scripts/generate-icons.js
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\scripts\generate-icons.js`
- **How:** дословно из RESEARCH.md раздел «Code Examples → scripts/generate-icons.js» (табы, двойные кавычки, ESM, top-level await):
	- Импорты: `sharp` из `"sharp"`, `fs` из `"node:fs/promises"`, `path` из `"node:path"`
	- Константы: `SOURCE = "scripts/source-icon.svg"`, `OUT = "static/icons"`, `BG = { r: 14, g: 14, b: 14, alpha: 1 }`
	- `await fs.mkdir(OUT, { recursive: true });`
	- `const svgBuffer = await fs.readFile(SOURCE);`
	- Массив `sizes`:
		- `{ name: "pwa-192x192.png", size: 192, padding: 0 }`
		- `{ name: "pwa-512x512.png", size: 512, padding: 0 }`
		- `{ name: "pwa-maskable-512x512.png", size: 512, padding: 51 }` — 10% safe area
		- `{ name: "apple-touch-icon.png", size: 180, padding: 0 }`
		- `{ name: "favicon-32x32.png", size: 32, padding: 0 }`
		- `{ name: "favicon-16x16.png", size: 16, padding: 0 }`
	- Цикл `for (const { name, size, padding } of sizes)`:
		- `const inner = size - padding * 2;`
		- `await sharp(svgBuffer).resize(inner, inner, { fit: "contain", background: BG }).extend({ top: padding, bottom: padding, left: padding, right: padding, background: BG }).png().toFile(path.join(OUT, name));`
		- `console.log("OK " + name);`
- **Done when:** файл существует, содержит все 6 размеров и `sharp`

### Task 03-02-02 — npm install
- **What:** Установить зависимости
- **How:** `cd c:/Users/ikoko/Projects/table-mind && npm install`
- **Done when:** `test -d node_modules/sharp` и `test -d node_modules/@sveltejs/kit`
- **Note:** sharp тянет нативный бинарник — при первом запуске может долго скачиваться. Если упадёт — повторить `npm install --force`

### Task 03-02-03 — Прогон скрипта
- **What:** Запустить генерацию иконок
- **How:** `cd c:/Users/ikoko/Projects/table-mind && node scripts/generate-icons.js`
- **Done when:** в `static/icons/` появились все 6 PNG-файлов (см. Tests)

### Task 03-02-04 — Коммит иконок
- **What:** Убедиться что `static/icons/*.png` НЕ игнорируются в `.gitignore`
- **How:** проверить `.gitignore` — если есть строка вида `static/icons` или `*.png` — удалить её или добавить негативное правило `!static/icons/*.png`
- **Done when:** `git status` показывает новые файлы в `static/icons/` как готовые к коммиту (не ignored)

## Tests Required
- `test -f scripts/generate-icons.js`
- `grep -q 'import sharp from "sharp"' scripts/generate-icons.js`
- `grep -q 'pwa-maskable-512x512.png' scripts/generate-icons.js`
- `grep -q 'padding: 51' scripts/generate-icons.js`
- `grep -q 'apple-touch-icon.png' scripts/generate-icons.js`
- `grep -q 'r: 14, g: 14, b: 14' scripts/generate-icons.js`
- `test -f static/icons/pwa-192x192.png`
- `test -f static/icons/pwa-512x512.png`
- `test -f static/icons/pwa-maskable-512x512.png`
- `test -f static/icons/apple-touch-icon.png`
- `test -f static/icons/favicon-32x32.png`
- `test -f static/icons/favicon-16x16.png`
- Каждый PNG должен быть > 0 байт: `test -s static/icons/pwa-192x192.png`
- `test -s static/icons/pwa-512x512.png` — файл ненулевого размера (sharp гарантирует >1KB для PNG 512x512)
- `git check-ignore static/icons/pwa-192x192.png; test $? -ne 0` — файл НЕ игнорируется

## Definition of Done
- [ ] `scripts/generate-icons.js` создан по образцу из RESEARCH.md
- [ ] `npm install` выполнен, `sharp` установлен
- [ ] Скрипт отработал без ошибок, в `static/icons/` 6 PNG-файлов
- [ ] Maskable иконка имеет 10% safe-area padding (изначально 512, внутренний контент 410)
- [ ] Иконки не попадают в `.gitignore`
- [ ] Все grep- и test-проверки проходят
