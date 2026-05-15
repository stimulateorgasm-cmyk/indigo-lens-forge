# План: Админка с аналитикой для Indigo Lab

## Контекст и решение по «соединить»

В проекте «Healthful Path Conference» админка (`AdminCrm.tsx`) работает поверх **своего** Supabase-бэкенда с таблицами тестов и регистраций. Прямо «подключиться к той же админке» из этого проекта нельзя — у Indigo Lab сейчас бэкенда нет вообще (заявки только улетают в Telegram через server function, нигде не сохраняются).

Поэтому делаем **аналогичную админку**, но на собственном бэкенде Indigo Lab. По духу и UX — как в Healthful Path: воронка, источники, таблица заявок, фильтры, защищённый вход.

## Что появится у пользователя

1. **Страница `/admin`** — закрыта паролем (ключ из URL `?key=...` или ввод в форму, как в Healthful Path).
2. **Дашборд аналитики:**
   - KPI-карточки: всего визитов, всего заявок, конверсия визит→заявка, заявки за 7/30 дней.
   - Воронка: визиты → скролл до формы → отправлена заявка.
   - Источники трафика: разбивка по `utm_source` / `utm_medium` / `utm_campaign` + «прямые/реферальные».
   - График заявок по дням (последние 30 дней).
   - Топ страниц-источников заявки (форма сверху vs снизу).
3. **Таблица заявок** с фильтрами (период, источник, форма) и поиском по имени/контакту, экспорт в CSV.
4. **Telegram-уведомления** продолжают приходить как сейчас.

## Что меняем в проекте

### Бэкенд (Lovable Cloud)
Включаем Lovable Cloud (Supabase под капотом). Создаём миграциями:

- `leads` — заявки: `id`, `name`, `contact`, `variant` (top/bottom), `utm_source`, `utm_medium`, `utm_campaign`, `referrer`, `landing_path`, `user_agent`, `created_at`.
- `page_visits` — визиты: `id`, `session_id`, `path`, `referrer`, `utm_*`, `user_agent`, `created_at`.
- `user_roles` + enum `app_role` (`admin`) и security-definer `has_role()` — по правилам Lovable.
- RLS: insert разрешён публично только для `leads` и `page_visits` (это лендинг без логина); select — только админам через `has_role()`.

### UTM-трекинг на фронте
- Хук `useUtmCapture`: при первом заходе читает `utm_*` из query, кладёт в `sessionStorage` (живёт до закрытия вкладки) + первый `referrer` и `landing_path`.
- Хук `useTrackPageVisit`: один раз за сессию шлёт визит в server fn `trackVisit` (insert в `page_visits`).

### Сохранение заявок
- `submitLead` (уже есть) расширяем: помимо отправки в Telegram, делает insert в `leads` с UTM/referrer/landing_path. Telegram-сообщение дополняется строкой «Источник: utm_source / utm_medium / utm_campaign».
- `LeadFormSection` начинает передавать UTM-контекст в `submit({ data: ... })`.

### Админка
- Маршрут `src/routes/admin.tsx` (TanStack file route).
- Server functions с `requireSupabaseAuth` + проверкой роли `admin`:
  - `getAdminStats` — агрегаты для KPI/воронки/источников/графика.
  - `getAdminLeads` — список заявок с фильтрами и пагинацией.
- UI: shadcn `Card`, `Table`, `Badge`, `Select`, `Input`, `Tabs`. Графики — `recharts` (уже в стеке).
- Вход: страница логина по email/паролю (Supabase Auth). Первый админ назначается вручную INSERT-ом в `user_roles`.

## Технические детали

- Telegram-секреты (`TELEGRAM_NOTIFY_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`) уже подключены — не трогаем.
- Никаких Edge Functions: вся серверная логика — `createServerFn` в `src/lib/*.functions.ts`.
- RLS: `leads.insert` и `page_visits.insert` — `to anon, authenticated with check (true)`; select — `using (public.has_role(auth.uid(), 'admin'))`.
- Защита `/admin`: layout `_authenticated` + проверка роли в server fn (двойной барьер: Supabase Auth + `has_role`).
- Экспорт CSV — на клиенте из загруженного списка.

## Этапы реализации

1. Включить Lovable Cloud, создать таблицы и RLS.
2. UTM-хуки + `trackVisit` server fn + вызов на главной.
3. Расширить `submitLead`: insert в `leads` + UTM в Telegram-сообщении.
4. Supabase Auth (email/пароль) + страница `/login`, layout `_authenticated`, роль `admin`.
5. `/admin`: KPI, воронка, источники, график, таблица с фильтрами, экспорт CSV.
6. Назначить вашего пользователя админом (после первой регистрации).

## Открытые вопросы

- Логин в админку: **email + пароль** (как в Supabase Auth) или достаточно простого пароля по URL-ключу как в Healthful Path? Рекомендую email+пароль — безопаснее и масштабируемее.
- Период хранения визитов — оставляем бессрочно или чистим старше 90 дней?
