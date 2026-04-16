---
phase: "1"
plan: "01-05"
name: "github-actions-deploy"
wave: 1
requires: []
req_ids:
  - DEPLOY-01
status: pending
autonomous: true
---

## Objective
Добавить GitHub Actions workflow, который при каждом пуше в `main` собирает SvelteKit (`npm run build`) и публикует папку `build/` на GitHub Pages.

## Context
Используем стандартный паттерн GitHub Pages Actions: `actions/checkout@v4` → `actions/setup-node@v4` (Node 20) → `npm ci` → `npm run build` → `actions/upload-pages-artifact@v3` (path `build`) → `actions/deploy-pages@v4`. Workflow копируется 1-в-1 из ZalAssist (RESEARCH.md раздел **Code Examples → .github/workflows/deploy.yml**).

Важно: workflow не собирает `vercel-api/` — это отдельный проект Vercel. GitHub Actions касается только SvelteKit.

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Code Examples → .github/workflows/deploy.yml**
- `c:\Users\ikoko\Projects\ZalAssist\.github\workflows\deploy.yml` как референс (при несоответствии — следовать RESEARCH.md)

## Tasks

### Task 01-05-01 — Директория .github/workflows
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\.github\workflows\`
- **How:** `mkdir -p .github/workflows`
- **Done when:** `test -d .github/workflows`

### Task 01-05-02 — deploy.yml
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\.github\workflows\deploy.yml`
- **How:** скопировать YAML из RESEARCH.md раздел «Code Examples → .github/workflows/deploy.yml» **дословно**:
	- `name: Deploy to GitHub Pages`
	- `on: push: branches: ["main"]` + `workflow_dispatch`
	- `permissions: contents: read, pages: write, id-token: write`
	- `concurrency: group: "pages", cancel-in-progress: false`
	- `jobs.build` на `ubuntu-latest`: checkout@v4 → setup-node@v4 (`node-version: 20`, `cache: "npm"`) → `npm ci` → `npm run build` → upload-pages-artifact@v3 (`path: "build"`)
	- `jobs.deploy`: `needs: build`, окружение `github-pages`, шаг `actions/deploy-pages@v4` с `id: deployment`
	- Отступы — **пробелы** (YAML не поддерживает табы в структурных отступах)
- **Done when:** файл существует, валидный YAML, содержит `npm run build`, `upload-pages-artifact@v3`, `deploy-pages@v4`

## Tests Required
- `test -f .github/workflows/deploy.yml`
- `grep -q 'Deploy to GitHub Pages' .github/workflows/deploy.yml`
- `grep -q 'node-version: 20' .github/workflows/deploy.yml`
- `grep -q 'npm run build' .github/workflows/deploy.yml`
- `grep -q 'upload-pages-artifact@v3' .github/workflows/deploy.yml`
- `grep -q 'deploy-pages@v4' .github/workflows/deploy.yml`
- `grep -q 'path: "build"' .github/workflows/deploy.yml`
- (опционально) `python -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"` — проверка валидности YAML

## Definition of Done
- [ ] `.github/workflows/deploy.yml` создан
- [ ] Используется Node 20, `npm ci`, `npm run build`
- [ ] Артефакт берётся из папки `build/`
- [ ] Двухэтапный flow (build → deploy) с корректными `permissions` и `concurrency`
- [ ] Все проверки из «Tests Required» проходят
- [ ] Примечание: реальный прогон workflow произойдёт только после мержа в `main` и включения GitHub Pages в настройках репо — это ручная проверка после Фазы 1
