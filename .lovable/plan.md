# INDIGO — Cinematic Dark Landing

Премиум одностраничный лендинг в эстетике Linear/Stripe/Apple: глубокий indigo-фон, объёмный волюметрический свет (magenta / violet / cyan), глассморфизм, sci-fi точность. Логотип INDIGO копируем из проекта Healthful Path Conference.

## 1. Design system (src/styles.css)

Тёмная палитра в `oklch`, semantic-токены для всех цветов (никаких inline `text-white`):

- `--background`: глубокий indigo-charcoal (~`oklch(0.12 0.04 280)`)
- `--surface-glass`: полупрозрачный slate с `backdrop-filter: blur`
- `--primary` (magenta) → `--primary-glow` (pink) — для CTA градиента
- `--accent-violet`, `--accent-cyan` — акценты и halo
- `--border`: `color-mix(in oklab, white 8%, transparent)` (microscopically thin)
- Готовые токены:
  - `--gradient-cta`: shimmering violet→pink→magenta
  - `--gradient-nebula`: радиальный magenta/violet/cyan фон
  - `--shadow-halo`: мягкий многослойный glow
  - `--shadow-glass`: inset hairline + soft drop
- Typography: Inter (через `@fontsource-variable/inter`), tracking-tight на h1/h2, размеры до `clamp(4rem, 9vw, 9rem)` для hero.

Глобальный фон: фиксированный `nebula` слой (3–4 радиальных градиента) + лёгкий film-grain SVG noise overlay.

## 2. Структура (TanStack routes)

Один маршрут `src/routes/index.tsx`, секции — отдельные компоненты в `src/components/landing/`:

```
HeroSection.tsx
SplitRealitySection.tsx
ConversionSection.tsx
SiteHeader.tsx
SiteFooter.tsx
```

Плюс примитивы:
```
GlassCard.tsx          // frosted контейнер с hairline border + halo
NebulaBackground.tsx   // фиксированный фон со светом + parallax по mouse
IPadFrame.tsx          // реалистичный mockup iPad Pro с видео внутри
WaveTransition.tsx     // animated SVG (хаос → синусоида)
GradientButton.tsx     // shimmering CTA
FloatingLabelInput.tsx // bottom-line input + floating label
```

`__root.tsx` обновим: title/description под INDIGO, OG-теги, шрифт Inter, lang="ru".

## 3. Section 1 — Hero (The Crown Jewel)

- **Header** (sticky, тонкий): слева логотип INDIGO (копируем `indigo-lab-logo-no-bg.png` из Healthful Path в `src/assets/indigo-logo.png`) + надпись `INDIGO · Психология бизнеса`. Справа — минималистичная nav и тонкая ghost-кнопка.
- **Headline** по центру, огромный (`clamp(64px, 9vw, 160px)`), tracking tight, две строки. Используем копию из брифа: «Разблокируйте Скрытую Прибыль.» Подзаголовок — приглушённый muted-foreground, max-w 640.
- **iPad Pro mockup** в центре:
  - CSS/SVG корпус: тонкая metallic-серая рамка с градиентом, скруглением 38px, внутренний bezel ~14px, перфектная тень снизу + контактная тень.
  - Reflection: лёгкий top-glare через `linear-gradient` overlay + `mix-blend-mode: screen`.
  - Внутри `<video autoplay muted loop playsinline poster>` — abstract loop. Сгенерируем через `videogen--generate_video` (10s, 1080p, 4:3): «volumetric violet-pink nebula particles, slow drift, fiber-optic light streaks, ultra dark indigo background, cinematic».
  - Поверх видео — полупрозрачный play-icon в круглой glass-кнопке (декоративный, не кликается).
  - Сзади — большой soft `radial-gradient` halo (magenta→violet→transparent), 1.5× размера планшета, с лёгким `animate` pulse через CSS keyframes.
- Тонкая полоска «scroll» индикатора под планшетом.

## 4. Section 2 — The Split Reality

- Full-bleed, 2 колонки (на mobile — стек), большие отступы (`py-32`, `gap-16`).
- **Left (Pain)** — заголовок «Цена выгорания», muted красно-оранжевые радиальные подсветки в углу. 3 GlassCard с тонкими lucide-иконами (`Droplets` — дырявое ведро, `TrendingDown`, `BatteryLow`). Карточки имеют hairline red-tinted border-glow on hover.
- **Right (Solution)** — radiant violet/cyan vibes. 3 GlassCard с иконками (`Activity`, `Zap`, `Shield`).
- **Между колонками** (или на всю ширину под ними на mobile) — `WaveTransition`:
  - SVG ширина 100%, высота ~280px.
  - Слева — хаотичная turbulent wave: несколько path с jittered control points, низкая opacity, красно-оранжевый stroke; анимируем `stroke-dashoffset` и `d` через CSS/Framer.
  - Постепенно (по горизонтали через `mask-image: linear-gradient`) переходит в чистую светящуюся sine-wave (violet→cyan), с `filter: drop-shadow` для glow и анимированными частицами вдоль path (несколько `<circle>` с `animateMotion` или CSS offset-path).
  - Запускается при scroll-in через IntersectionObserver.

## 5. Section 3 — Conversion & Proof

- Большой quote block по центру, тонкий serif-italic? Нет — оставляем Inter italic, размер `clamp(28px, 3.5vw, 44px)`. Под цитатой — стилизованный аватар (круг с inicialами + soft gradient ring) и подпись.
- **Glass capture card**: центр экрана, max-w-560, intricate border glow (двойной слой: hairline white/10 + outer radial halo).
  - Поля: Имя, Email, Telegram (опц.) — `FloatingLabelInput` (bottom-line only, label плавает вверх при focus, плавный underline-grow на focus).
  - CTA `GradientButton`: shimmering violet→pink, `background-size: 200%` + анимация `background-position` (subtle keyframe), inner glow, hover — усиление halo.
  - Под формой — 1 строка disclaimer muted-foreground.
- Форма пока без backend: `onSubmit` показывает toast «Заявка принята» (sonner уже есть в проекте). Лиды никуда не уходят — это явное требование пользователя.

## 6. Footer

Тонкий, 2 ряда: лого + копирайт INDIGO 2026, минимальный nav, social icons (lucide). Hairline top border.

## 7. Микро-взаимодействия и motion

- `NebulaBackground`: лёгкий parallax по `mousemove` (transform translate ~10–20px) + автоматический медленный drift через CSS `@keyframes`.
- Hero headline и iPad: появление через `IntersectionObserver` + utility-классы `animate-fade-in` / `animate-scale-in` (уже в `tw-animate-css`).
- Все hover-эффекты — `transition: 300ms ease`, lift `-translate-y-0.5`, усиление halo.
- Уважаем `prefers-reduced-motion` — отключаем drift/pulse.

## 8. Ассеты

- `cross_project--copy_project_asset` → `indigo-lab-logo-no-bg.png` → `src/assets/indigo-logo.png`.
- `videogen--generate_video` (10s, 1080p, 4:3) для iPad-экрана, сохраняем в `src/assets/hero-loop.mp4`. Делаем poster через первый кадр (или генерим отдельный JPG через `imagegen` 1024×768 как fallback poster).
- Дополнительно (опц.): `imagegen` 1 PNG абстрактной туманности для backup poster.

## 9. SEO / metadata

- `<title>`: «INDIGO — Психология бизнеса. Разблокируйте скрытую прибыль» (≤60 chars урезаем).
- `meta description` ≤160 chars.
- OG: og:title, og:description, og:image (poster туманности 1200×630 — отдельная генерация), twitter:card=summary_large_image.
- Один `<h1>` в Hero, semantic `<section>`/`<header>`/`<footer>`, alt для логотипа и видео-poster.

## 10. Технические детали

- Текстовая копия: используем фразы из брифа («Разблокируйте Скрытую Прибыль», «Цена выгорания»). Где image_0/image_1 не предоставлены — пишу нейтральные placeholder-копии в том же тоне (буду помечать `// TODO copy`), чтобы потом легко заменить.
- Все цвета — только через токены. Никаких `text-white`, `bg-black`, `bg-[#...]`.
- `backdrop-filter: blur` ок в превью (Cloudflare-Worker ограничение касается только ssr-render видео в Remotion, не фронта).
- Зависимостей минимум: `@fontsource-variable/inter` и (опционально) `framer-motion` для wave-transition. Если получится без framer-motion — не ставим.

## 11. Шаги реализации

1. Скопировать логотип из Healthful Path.
2. Сгенерировать loop-видео для iPad + OG/poster image.
3. Расширить `src/styles.css` — токены, градиенты, halo-shadow, keyframes.
4. Установить `@fontsource-variable/inter` (+ framer-motion при необходимости).
5. Реализовать примитивы: `NebulaBackground`, `GlassCard`, `IPadFrame`, `WaveTransition`, `GradientButton`, `FloatingLabelInput`.
6. Собрать секции `HeroSection`, `SplitRealitySection`, `ConversionSection`, `SiteHeader`, `SiteFooter`.
7. Заменить `src/routes/index.tsx` placeholder на реальный лендинг.
8. Обновить `__root.tsx`: title/description/OG/lang.
9. Проверить виджет на 1440 / 1024 / 390, подправить spacing rhythm.

## Открытые моменты (могу решить по ходу)

- Точные русские тексты для подзаголовка Hero, 3 пунктов Pain, 3 пунктов Solution, цитаты, имени автора цитаты — пока поставлю sensible placeholder-копию в тон бренда; ты сможешь заменить одной правкой.
- Если хочешь конкретные тексты сразу — пришли image_0.png и image_1.png или текстом.
