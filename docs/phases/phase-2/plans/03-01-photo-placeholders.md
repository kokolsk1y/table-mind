---
phase: "2"
plan: "03-01"
name: "photo-placeholders"
wave: 3
requires:
  - "01-01"
req_ids:
  - MENU-01
  - UI-03
status: pending
autonomous: true
---

## Objective
Создать скрипт `scripts/generate-placeholders.js` который генерирует placeholder-изображения (WebP, 400x300, с названием блюда) для всех позиций из `catalog.json`. Это позволяет собрать и протестировать приложение без реальных стоковых фото. Реальные фото будут заменены вручную позже.

## Context
Executor должен читать перед началом:
- `c:\Users\ikoko\Projects\table-mind\static\catalog.json` (создан в 01-01) — список всех id для генерации
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-2\CONTEXT.md` — формат фото: WebP, ~400x300

Подход: использовать `sharp` (уже установлен в devDependencies) для создания WebP-изображений. Каждый placeholder — серый прямоугольник 400x300 с SVG-наложением текста (название блюда). Это быстрее и надёжнее чем canvas.

Альтернатива (если sharp SVG overlay сложен): создать минимальные серые WebP 400x300 без текста. Главное — файлы существуют и загружаются в `<img>`.

Скрипт запускается однократно: `node scripts/generate-placeholders.js`. Создаёт директорию `static/photos/` и файлы `{id}.webp` для каждой позиции из каталога.

## Tasks

### Task 03-01-01 — Создать scripts/generate-placeholders.js
- **What:** Создать файл `c:\Users\ikoko\Projects\table-mind\scripts\generate-placeholders.js`
- **How:** Node.js скрипт:
  1. Читает `static/catalog.json` через `fs.readFileSync` и `JSON.parse`
  2. Создаёт директорию `static/photos/` если не существует (`fs.mkdirSync` с `recursive: true`)
  3. Для каждого элемента каталога:
     - Генерирует placeholder WebP 400x300 через sharp:
       ```js
       import sharp from "sharp";
       import { readFileSync, mkdirSync, existsSync } from "fs";
       import { join, dirname } from "path";
       import { fileURLToPath } from "url";

       const __dirname = dirname(fileURLToPath(import.meta.url));
       const root = join(__dirname, "..");
       const catalog = JSON.parse(readFileSync(join(root, "static/catalog.json"), "utf-8"));
       const photosDir = join(root, "static/photos");

       mkdirSync(photosDir, { recursive: true });

       for (const item of catalog) {
         const filename = `${item.id}.webp`;
         const filepath = join(photosDir, filename);
         if (existsSync(filepath)) {
           console.log(`SKIP ${filename} (exists)`);
           continue;
         }
         // SVG с названием блюда на сером фоне
         const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
           <rect width="400" height="300" fill="#2a2a2a"/>
           <text x="200" y="140" font-family="sans-serif" font-size="18" fill="#888"
                 text-anchor="middle" dominant-baseline="middle">${escapeXml(item.name)}</text>
           <text x="200" y="170" font-family="sans-serif" font-size="14" fill="#555"
                 text-anchor="middle" dominant-baseline="middle">${escapeXml(item.category)}</text>
         </svg>`;

         await sharp(Buffer.from(svg))
           .resize(400, 300)
           .webp({ quality: 60 })
           .toFile(filepath);

         console.log(`OK ${filename}`);
       }

       function escapeXml(str) {
         return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
       }
       ```
     - Важно: скрипт ESM (import), `package.json` имеет `"type": "module"`
     - Пропускает файлы которые уже существуют (чтобы не перезаписывать реальные фото при повторном запуске)
  4. Добавить npm-скрипт в `package.json`: `"generate-photos": "node scripts/generate-placeholders.js"`

- **Done when:** скрипт существует, содержит `sharp`, `catalog.json`, `webp`, `static/photos`

### Task 03-01-02 — Запустить скрипт генерации
- **What:** Выполнить `node scripts/generate-placeholders.js` из корня проекта
- **How:** Запустить команду и убедиться что в `static/photos/` появились WebP файлы для всех позиций каталога
- **Done when:** количество WebP файлов в `static/photos/` >= 40

### Task 03-01-03 — Добавить npm-скрипт
- **What:** Добавить в `package.json` поле `"generate-photos"` в секцию `scripts`
- **How:** Добавить строку `"generate-photos": "node scripts/generate-placeholders.js"` в секцию `scripts` файла `c:\Users\ikoko\Projects\table-mind\package.json`
- **Done when:** `grep -q "generate-photos" package.json` возвращает 0

## Tests Required
- `test -f c:/Users/ikoko/Projects/table-mind/scripts/generate-placeholders.js`
- `test -d c:/Users/ikoko/Projects/table-mind/static/photos`
- `ls c:/Users/ikoko/Projects/table-mind/static/photos/*.webp | wc -l` — >= 40
- `grep -q "generate-photos" c:/Users/ikoko/Projects/table-mind/package.json`
- `node -e "const fs=require('fs'); const cat=require('./static/catalog.json'); const photos=fs.readdirSync('./static/photos').filter(f=>f.endsWith('.webp')); console.log('catalog:',cat.length,'photos:',photos.length); if(photos.length < cat.length*0.8) process.exit(1)"` (из корня проекта)

## Definition of Done
- [ ] `scripts/generate-placeholders.js` создан
- [ ] Скрипт успешно генерирует WebP placeholder для каждой позиции каталога
- [ ] `static/photos/` содержит >= 40 файлов `.webp`
- [ ] Каждый файл 400x300 пикселей, формат WebP
- [ ] Скрипт пропускает уже существующие файлы
- [ ] npm-скрипт `generate-photos` добавлен в package.json
- [ ] Скрипт использует ESM imports (не require)
