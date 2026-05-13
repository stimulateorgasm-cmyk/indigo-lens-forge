## Что меняем

Полная переработка контента и порядка секций главной (`src/routes/index.tsx`). Цель — собрать страницу в порядке: Заголовок → Видео → Форма → Амплитуда → Преимущества метода → Отзыв → Научные статьи → Форма → Футер.

## Новая структура `src/routes/index.tsx`

```
<NebulaBackground />
<SiteHeader />
<HeroSection />              // заголовок + промо-видео + крупная Play + кнопки платформ
<LeadFormSection id="lead-top" />
<AmplitudeSection />         // бывш. WaveTransition, компактный
<MethodAdvantagesSection />  // 7 пунктов с иконками
<TestimonialSection />       // Максим Чёрный + фото
<ResearchSection />          // 10 статей, embed PDF
<LeadFormSection id="lead-bottom" />
<SiteFooter />
```

Удаляем `SplitRealitySection` и `ConversionSection` (текущая нижняя форма с цитатой) — их роль перераспределена.

## Поправки по секциям

### 1. HeroSection
- Eyebrow «Новый стандарт лидерства» → **«Новый уровень эмоциональной устойчивости и адаптивности вашей команды»**.
- Заголовок «Разблокируйте скрытую прибыль» — оставляем.
- Видеоблок (`IPadFrame` → переименуем в `HeroVideo`):
  - Реальный `<video>` с `poster`, `controls` появляются по клику.
  - Источники конфигурируются в `src/lib/video-sources.ts` через `videoSources = { mp4?, youtube?, vk?, rutube?, cloud? }`. Сейчас всё `undefined`/placeholder; когда заказчик пришлёт — подставим. Если есть `youtube`/`vk`/`rutube` — рендерим соответствующий `<iframe>` поверх постера после клика; иначе HTML5 `<video>`.
  - Кнопка Play — крупная (h-28 w-28), увеличенная иконка, явный hover/focus, видимый текст «Смотреть видео».
  - Убираем плавающую анимацию (мешает читаемости).

#### Кнопки платформ под видео (как в Shumkin Scale Final)
Под фреймом видео — горизонтальный ряд кнопок-«пилюль» для YouTube / VK / Rutube / Облако. Стиль повторяет `TariffOptionButton`:
- `rounded-2xl`, `px-6 py-4`, `transition-all duration-200`.
- В неактивном состоянии: `bg-card border border-border text-card-foreground hover:border-primary/30` (через токены текущей темы).
- В hover/active: фон-градиент `linear-gradient(90deg, #301333 0%, #903999 39.9%, #CD637C 98.08%)` с белым текстом и `shadow-medium` — заведём как новый утилити-класс или CSS-переменную `--gradient-platform-btn` в `src/styles.css`, чтобы не зашивать hex в компонентах.
- Слева — иконка платформы (lucide `Youtube`, `PlaySquare`, `Film`, `Cloud` или их SVG-аналоги), справа — стрелка `ArrowUpRight`.
- Если ссылка для платформы ещё не задана — кнопка `disabled`, приглушена, тултип «Скоро».

Файл: новый компонент `src/components/landing/PlatformButton.tsx` + использование в `HeroVideo`.

### 2. LeadFormSection (новый общий компонент)
Файл `src/components/landing/LeadFormSection.tsx`. Используется дважды (верх/низ), `variant?: "compact" | "full"` для лёгких отличий копирайта.

Поля:
- Имя — required.
- «Телефон или Telegram» — одно поле, required, валидация: непустое, ≤120 символов, регэксп пропускает `+`, цифры, пробелы, `-`, `(`, `)`, `@`, латиницу.
- Email — **убрано**.
- Чекбокс «Согласен на обработку персональных данных» — required.

CTA: **«Записаться на консультацию»**.
Подзаголовок: «Бесплатная 45-минутная консультация с партнёром Indigo Lab.» (никаких фильтров по выручке).

Валидация — `zod`. На submit пока `toast.success` (бэкенд не подключаем).

### 3. AmplitudeSection
Файл `src/components/landing/AmplitudeSection.tsx` — выносим бывший `WaveTransition`-блок из `SplitRealitySection`.
- Уменьшаем высоту: `py-16 md:py-20`, волна `h-24`.
- В `WaveTransition.tsx` уменьшаем амплитуду и `strokeWidth`, добавляем сглаживание (cubic-кривые) — линия становится ровнее.
- Подписи по краям сохраняем: «Хаос · турбулентность» → «Амплитуда · синхронизация».

### 4. MethodAdvantagesSection (новая)
Файл `src/components/landing/MethodAdvantagesSection.tsx`.
- H2: «Биопсихосоциальный подход отличается от традиционной психологии тем, что:»
- Сетка: 1 / 2 / 3 колонки (sm/md/lg); 7-й пункт — full-width.
- Каждый пункт: иконка lucide в glass-плашке + заголовок + описание.

| # | Иконка | Заголовок |
|---|--------|-----------|
| 1 | Stethoscope | Диагностика предшествует работе |
| 2 | Target | Работа с причинами, а не с симптомами |
| 3 | Globe | Холистическое восприятие |
| 4 | Layers | Интегративный подход |
| 5 | FlaskConical | Научная опора |
| 6 | Crosshair | Конкретизация абстрактных запросов |
| 7 | TrendingUp | Ориентация на результат |

### 5. TestimonialSection (новая)
Файл `src/components/landing/TestimonialSection.tsx`.
- Слева — фото Максима Чёрного в круглой рамке с halo. Кладём `src/assets/testimonial-maxim.jpg` (сгенерированный портрет-плейсхолдер; заменяется реальным фото).
- Справа — цитата большим italic-шрифтом:
  > «Когда руководитель выходит из этой синусоиды, он перестаёт тратить ресурс на борьбу с собой. У него освобождается энергия на стратегию и рост»
- Подпись: **Максим Чёрный** · Владелец дизайн-студии Artum и онлайн-школы дизайна Маши Чёрной.

### 6. ResearchSection (новая)
Файл `src/components/landing/ResearchSection.tsx`.
- Плашка-«пилюля»: «Опубликовано более 10 научных статей».
- Список из 10 карточек: номер + заголовок, бейдж «★ Ключевая статья» для №5 и №8.
- Кнопка «Читать на сайте» открывает модалку с `<iframe>`-просмотром PDF (когда PDF появится). Сейчас — disabled с подписью «PDF скоро».
- Ссылка «Оригинал в журнале» рядом — внешняя URL (как в ТЗ), `target="_blank" rel="noopener"`.
- Данные в массиве `articles: { id, title, journalUrl, pdfUrl?, featured?, comingSoon? }`. №10 (фобии) — `comingSoon: true`.

### 7. SiteFooter
Не трогаем (логотип уже исправлен ранее).

## Технические детали

- Шрифты/типографика: только текущие токены (`text-gradient`, `glass`, `glass-strong`, `--magenta/--violet/--cyan`). Никаких новых шрифтов; единая display-семья и трекинг `-0.02em…-0.04em` во всех заголовках.
- В `src/styles.css` добавим один токен `--gradient-platform-btn: linear-gradient(90deg, #301333 0%, #903999 39.9%, #CD637C 98.08%);` для кнопок платформ.
- Валидация форм — `zod` + `useState`.
- Все новые компоненты — презентационные, без бэкенда.
- Зависимости: ничего ставить не нужно.
- Домен `indiegolab.com`: настраивается в Project Settings → Domains, кодом не делается.

## Файлы

- редактируем: `src/routes/index.tsx`, `src/components/landing/HeroSection.tsx`, `src/components/landing/IPadFrame.tsx` (→ `HeroVideo.tsx`), `src/components/landing/WaveTransition.tsx`, `src/styles.css`
- создаём: `src/components/landing/LeadFormSection.tsx`, `src/components/landing/AmplitudeSection.tsx`, `src/components/landing/MethodAdvantagesSection.tsx`, `src/components/landing/TestimonialSection.tsx`, `src/components/landing/ResearchSection.tsx`, `src/components/landing/PlatformButton.tsx`, `src/lib/video-sources.ts`, `src/assets/testimonial-maxim.jpg`
- удаляем: `src/components/landing/SplitRealitySection.tsx`, `src/components/landing/ConversionSection.tsx`

## Открытые вопросы (если без ответа — поеду по дефолтам)

1. Фото Максима — генерировать нейтральный портрет-плейсхолдер или оставить инициалы в круге до получения настоящего фото? **Дефолт:** сгенерировать плейсхолдер.
2. Кнопки платформ — показывать все 4 (YouTube/VK/Rutube/Облако) сразу как disabled или скрывать те, где нет ссылки? **Дефолт:** показывать все 4 disabled, чтобы было видно структуру.
3. PDF-просмотр статей: оставить «Читать на сайте» disabled до появления PDF или сразу открывать оригинал в журнале? **Дефолт:** disabled + видимая ссылка на оригинал.