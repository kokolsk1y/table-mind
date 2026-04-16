---
phase: "1"
plan: "01-04"
name: "static-assets"
wave: 1
requires: []
req_ids:
  - DEPLOY-01
status: pending
autonomous: true
---

## Objective
Создать статические файлы, которые SvelteKit копирует в билд как есть: `.nojekyll` для GitHub Pages и `robots.txt`.

## Context
GitHub Pages по умолчанию обрабатывает репозиторий через Jekyll, который игнорирует папки, начинающиеся с `_` (а SvelteKit кладёт чанки в `_app/` — в TableMind переименовано в `app/` через `appDir`). Файл `.nojekyll` отключает Jekyll полностью — это дополнительная страховка и требование DEPLOY-01.

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Files This Phase Will Touch** (строка `static/.nojekyll`)

## Tasks

### Task 01-04-01 — static/.nojekyll
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\static\.nojekyll`
- **How:** пустой файл (ноль байт). В bash: `: > static/.nojekyll` или `touch static/.nojekyll`
- **Done when:** `test -f static/.nojekyll`

### Task 01-04-02 — static/robots.txt
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\static\robots.txt`
- **How:** минимальный разрешающий robots:
	```
	User-agent: *
	Allow: /
	```
- **Done when:** файл существует, содержит `User-agent: *`

## Tests Required
- `test -f static/.nojekyll`
- `test -f static/robots.txt`
- `grep -q 'User-agent' static/robots.txt`
- `test ! -s static/.nojekyll || echo "warn: .nojekyll should be empty"` — файл должен быть пустым (допустимо содержимое, но ожидается 0 байт)

## Definition of Done
- [ ] `static/.nojekyll` существует и пуст
- [ ] `static/robots.txt` существует с дефолтным содержимым
