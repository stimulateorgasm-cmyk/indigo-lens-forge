## Что сделаем

Заменим текущую авторизацию через Supabase Auth (email + Google OAuth + таблица `user_roles`) на простой ввод пароля — как в проекте Healthful Path Conference.

## Почему /login сейчас 404

На опубликованном `b2b.indigolab.pro` ещё крутится старая сборка (без роутов `/login` и `/admin`). После того как переделаем вход и опубликуем заново — 404 уйдёт. В превью `id-preview--*.lovable.app` страница уже доступна.

## План

1. **Секрет `ADMIN_PASSWORD`** — добавим через Lovable Cloud secrets, спросим у вас значение.

2. **`/login`** — оставим один input «Пароль». При сабмите кладём пароль в `sessionStorage` (`indigo_admin_key`) и редиректим в `/admin`. Никаких email/Google/Supabase Auth.

3. **`/admin`** — вместо `useAuth()` (Supabase сессия) проверяем наличие ключа в `sessionStorage`. Если нет — редирект на `/login`. Кнопка «Выйти» чистит ключ.

4. **Server functions (`src/lib/admin.functions.ts`)** — убираем `requireSupabaseAuth` и `ensureAdmin(userId)`. Вместо этого новый middleware `requireAdminPassword`: читает заголовок `Authorization: Bearer <key>` и сравнивает с `process.env.ADMIN_PASSWORD` через `timingSafeEqual`. Клиент шлёт ключ через кастомный `functionMiddleware` (читает из `sessionStorage`).

5. **Чистка** — удаляем теперь ненужное:
   - `src/hooks/useAuth.ts`
   - таблицу `user_roles` и функцию `has_role()` (миграцией `DROP`)
   - привязку `attachSupabaseAuth` в `src/start.ts` заменяем на новый attacher с админ-паролем
   - `supabase--configure_social_auth` Google остаётся включённым на бэке, но не используется — можно отключить позже

6. **Lead-форма и трекинг визитов** — не трогаем. Они пишутся анонимно, RLS уже разрешает `INSERT` всем.

7. **Публикация** — после правок вы публикуете, и `b2b.indigolab.pro/login` начинает работать.

## Технические детали

- Сравнение пароля: `crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(process.env.ADMIN_PASSWORD!))` с защитой от несовпадения длин.
- Поддержим вход по URL `?key=...` (как в РПП): если параметр есть — кладём в storage и сразу чистим из URL.
- Тип контекста серверных функций: `{ adminKey: string }` — `userId` больше не нужен.

## Открытые вопросы

1. Какой пароль ставим в `ADMIN_PASSWORD`? (придумайте, либо сгенерирую случайный)
2. Удалить таблицу `user_roles` или оставить «на будущее»?
