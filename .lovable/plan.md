## Проблема

В `src/components/landing/SiteFooter.tsx` ссылки ведут на несуществующие якоря (`#contact`, `#problem`) — поэтому кликать «нечем». Нужно привести их в соответствие с теми же якорями, что и в шапке.

Параллельно из проекта **Healthful Path Conference** можно подтянуть подтверждённые контактные данные Indigo Lab — они там уже используются в продакшене.

## Данные из соседнего проекта

Из `src/components/Footer.tsx` и `src/components/Experts.tsx`:

- Email: `info@indigolab.pro`
- Telegram Андрея Индиго: `@andreyIndigo` → `https://t.me/andreyIndigo`
- Открытый чат специалистов Indigo Lab: `https://t.me/coachfor1mln`
- Бренд-строка: «Indigo Lab · Психология бизнеса» (у нас) vs «Научно обоснованные инструменты…» (там — для конференции, нам не подходит, оставляем нашу)
- Логотип `IndigoLogo` уже одинаковый в обоих проектах

Эти данные используем как реальные контакты в подвале вместо «мёртвых» ссылок.

## Что меняем — `src/components/landing/SiteFooter.tsx`

Структура подвала: 3 колонки (как в Healthful Path), на мобайле — стек.

**Колонка 1 — бренд**
- `IndigoLogo size={32}` + «Indigo Lab · Психология бизнеса»
- Короткое описание: «Indigo Method — доказательная программа развития команд и руководителей.»

**Колонка 2 — навигация (синхронно с шапкой)**
- «Метод» → `#method`
- «Исследования» → `#research`
- «Записаться» → `#lead-top`

**Колонка 3 — контакты**
- `Mail` иконка + `info@indigolab.pro` (`mailto:`)
- `MessageCircle` иконка + «Telegram Андрея Индиго» → `https://t.me/andreyIndigo` (target=_blank, rel=noopener)
- `MessageCircle` иконка + «Открытый чат Indigo Lab» → `https://t.me/coachfor1mln`

**Нижняя полоска**
- `© {year} Indigo Lab. Все права защищены.`
- Убираем ссылки «Политика конфиденциальности» / «Условия использования» (страниц нет — иначе снова мёртвые ссылки). Если позже захотим — добавим, когда появятся роуты.

Стилистика — текущая тёмная тема: `text-muted-foreground`, hover `text-foreground`, `border-[color-mix(in_oklab,white_8%,transparent)]`, `glass`/hairline опционально. Иконки из `lucide-react` (`Mail`, `MessageCircle`).

## Технические детали

- Файл правим один: `src/components/landing/SiteFooter.tsx`.
- Импортируем `Mail`, `MessageCircle` из `lucide-react`.
- Внешние ссылки: `target="_blank" rel="noopener noreferrer"`.
- Внутренние якоря используют уже добавленный `scroll-behavior: smooth` и `scroll-margin-top` из `src/styles.css` — отдельных правок CSS не нужно.
- Других файлов не трогаем.
