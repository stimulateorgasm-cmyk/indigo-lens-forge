## 1. Быстрые правки

- **MethodAdvantagesSection** — в карточке «Диагностика предшествует работе» в `body` заменить `Не лечим вслепую.` → `Не вмешиваемся вслепую.`
- **ResearchSection** — статья №6 («Психокоррекция эмоционального выгорания с применением БПСП») получает `featured: true` и переезжает на 3-ю позицию. Остальные сдвигаются. Номера `id` оставляю исходные (это идентификаторы статей, не позиция) — порядок отображения определяет порядок в массиве.

## 2. CRM: события (CTA, калькулятор, FAQ, видео)

### База
Новая таблица `analytics_events`:
- `event_name` (text) — `cta_click`, `calculator_use`, `faq_open`, `video_play`, `video_platform_click`, `download_pdf`
- `props` (jsonb) — `{ source: 'hero'|'sticky'|'header'|'lead_top'|'lead_bottom', platform?: 'youtube'|'rutube'|'vk', faq_id?, calc_input? }`
- `session_id` (text, ≤100)
- `path` (text)
- `user_agent` (text)
- `created_at` (timestamptz)

RLS: только INSERT для `anon|authenticated` с длинными лимитами; SELECT закрыт (читается через `supabaseAdmin` в админке).

### Клиент
- `src/lib/track.ts` — функция `trackEvent(name, props?)`, дёргает server fn `trackEvent` (по аналогии с `trackVisit`); `session_id` берёт из `getSessionId()`.
- `src/lib/analytics.functions.ts` — добавить `trackEvent` server fn с zod-валидацией.
- Расставить вызовы:
  - `GradientButton`-CTA в Hero / Sticky / LeadForm-кнопки → `cta_click` + `source`
  - `HiddenProfitCalculator` — `calculator_use` при сабмите (с введёнными значениями)
  - `FaqSection` — `faq_open` при открытии аккордеона (с индексом вопроса)
  - `HeroVideo` / `PlatformButton` — `video_play` (первое нажатие play), `video_platform_click` (YouTube/Rutube/VK), `download_pdf`

### Админка
В `/admin` под графиком «Заявки и визиты» — новый блок **«Активность»**:
- Карточки KPI: `Кликов CTA (30д)`, `Использований калькулятора`, `Открытий FAQ`, `Просмотров видео`
- Таблица «Топ событий за 30 дней» — `event_name` + counts
- Bar-chart по источникам CTA (hero / sticky / lead_top / lead_bottom)
- Серверная функция `getAdminEvents` агрегирует через `supabaseAdmin`.

## 3. CRM: статус заявки + заметки

### База
ALTER TABLE `leads`:
- `status` text NOT NULL DEFAULT `'new'` CHECK через триггер (`new` / `in_progress` / `closed`)
- `notes` text (необязательно)

### Сервер
- `updateLeadStatus(id, status)` и `updateLeadNotes(id, notes)` через `supabaseAdmin`, под защитой существующей `requireAdmin` миддлвари (та же, что у `getAdminLeads`).
- `getAdminLeads` возвращает `status` и `notes`.

### Админка
В таблицу заявок:
- Новый столбец `Статус` с `<Select>` (новый/в работе/закрыт) — onChange дёргает `updateLeadStatus`, инвалидирует `admin-leads`.
- Кликом по строке раскрывается полоска с `<Textarea>` заметок (debounced save).
- Фильтр «Статус» рядом с «Форма».

## 4. Подвал: 4 колонки

Перестроить `SiteFooter` в `grid md:grid-cols-2 lg:grid-cols-4`:

1. **Бренд** — логотип + описание (как сейчас).
2. **Навигация** — Метод (`#method`), Исследования (`#research`), Калькулятор прибыли (`#calculator`), FAQ (`#faq`), Записаться (`#lead-top`).
3. **Контакты** — почта, Telegram Андрея, открытый чат (как сейчас).
4. **Документы** — Политика конфиденциальности (`/privacy`).

Под капотом:
- `MethodAdvantagesSection`, `HiddenProfitCalculator`, `FaqSection` получают `id` на корневом `<section>` (часть уже есть — проверить и допроставить).
- Новый роут `src/routes/privacy.tsx` — заглушка с типовым текстом 152-ФЗ (контактный email из проекта). `head()` с `robots: noindex` чтобы не конкурировать с лендингом.

## 5. План работ (порядок)

1. Мелкие правки (текст + перестановка статьи). 
2. Миграция `analytics_events` + `leads.status/notes` (один файл миграции).
3. Server fns: `trackEvent`, `getAdminEvents`, `updateLeadStatus`, `updateLeadNotes`, расширение `getAdminLeads`.
4. Клиентский `track.ts` + расстановка вызовов.
5. UI в `/admin`: блок Активность, столбец Статус, заметки.
6. Подвал: 4 колонки + якоря + страница `/privacy`.

## Что осталось открытым из прошлых обсуждений (не теряем)

- **Текст плашки в hero** — нужны конкретные цифры/факты.
- **FAQ** — нужны финальные ответы вместо плейсхолдеров.
