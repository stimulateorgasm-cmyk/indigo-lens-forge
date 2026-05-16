import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — Indigo Lab" },
      { name: "robots", content: "noindex,nofollow" },
      {
        name: "description",
        content:
          "Политика обработки персональных данных Indigo Lab в соответствии с 152-ФЗ.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 pb-20 pt-32 md:pt-40">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
        >
          ← На главную
        </Link>
        <h1
          className="mt-6 font-semibold tracking-[-0.03em] text-gradient"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05 }}
        >
          Политика конфиденциальности
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Действует с {new Date().toLocaleDateString("ru-RU")}. Настоящая политика
          разработана в соответствии с Федеральным законом № 152-ФЗ «О персональных
          данных».
        </p>

        <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground md:text-base">
          <section>
            <h2 className="text-foreground">1. Кто обрабатывает данные</h2>
            <p>
              Оператор — Indigo Lab (далее — «мы»). Контакт для обращений по вопросам
              обработки персональных данных:{" "}
              <a
                href="mailto:info@indigolab.pro"
                className="text-foreground underline"
              >
                info@indigolab.pro
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-foreground">2. Какие данные мы собираем</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>имя, контактные данные (телефон, email, Telegram), которые вы указываете в форме заявки;</li>
              <li>технические данные о визите: UTM-метки, реферер, путь страницы, User-Agent, идентификатор сессии;</li>
              <li>события взаимодействия с лендингом (клики по кнопкам, использование калькулятора, открытие вопросов).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground">3. Цели обработки</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>обработка заявки и связь с вами для согласования бесплатной диагностики;</li>
              <li>улучшение работы сайта и качества предложений;</li>
              <li>исполнение требований законодательства РФ.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground">4. Сроки и условия хранения</h2>
            <p>
              Данные хранятся до отзыва согласия или до истечения сроков, установленных
              законодательством. Хранение реализовано на инфраструктуре наших технологических
              партнёров с применением шифрования при передаче.
            </p>
          </section>

          <section>
            <h2 className="text-foreground">5. Ваши права</h2>
            <p>
              Вы вправе запросить уточнение, блокирование или удаление ваших персональных
              данных, а также отозвать согласие на их обработку. Для этого напишите на{" "}
              <a
                href="mailto:info@indigolab.pro"
                className="text-foreground underline"
              >
                info@indigolab.pro
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-foreground">6. Изменения политики</h2>
            <p>
              Мы можем обновлять политику. Актуальная версия всегда доступна на этой
              странице.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}