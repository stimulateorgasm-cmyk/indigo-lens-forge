import { Star, ExternalLink, FileText } from "lucide-react";

interface Article {
  id: number;
  title: string;
  journalUrl?: string;
  pdfUrl?: string;
  featured?: boolean;
  comingSoon?: boolean;
}

const articles: Article[] = [
  { id: 1, title: "Психологическая устойчивость руководителя в условиях неопределённости" },
  { id: 2, title: "Эмоциональное выгорание собственников бизнеса: модели и интервенции" },
  { id: 3, title: "Адаптивность команды как фактор операционной прибыли" },
  { id: 4, title: "Психосоматика стресса в управленческой деятельности" },
  { id: 5, title: "Биопсихосоциальная модель в коучинге первых лиц", featured: true },
  { id: 6, title: "Когнитивные искажения при принятии стратегических решений" },
  { id: 7, title: "Личностные сценарии и архитектура организационных конфликтов" },
  { id: 8, title: "Регуляция аффекта и долгосрочная эффективность лидера", featured: true },
  { id: 9, title: "Травма и лидерство: невидимые ограничения роста" },
  { id: 10, title: "Фобические реакции в управленческой практике", comingSoon: true },
];

export function ResearchSection() {
  return (
    <section id="research" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]" />
            Опубликовано более 10 научных статей
          </span>
          <h2
            className="font-semibold tracking-[-0.03em] text-gradient"
            style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", lineHeight: 1.1 }}
          >
            Научная база метода
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Исследования, статьи и публикации, на которых стоит подход Indigo Lab.
          </p>
        </div>

        <ul className="grid gap-3 md:grid-cols-2">
          {articles.map((a) => (
            <li
              key={a.id}
              className="group relative overflow-hidden rounded-2xl glass p-5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl glass text-sm font-medium text-muted-foreground">
                  {String(a.id).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {a.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--magenta)_25%,transparent)] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-foreground">
                        <Star className="h-3 w-3" /> ключевая
                      </span>
                    )}
                    {a.comingSoon && (
                      <span className="rounded-full bg-[color-mix(in_oklab,white_8%,transparent)] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        скоро
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground md:text-base">
                    {a.title}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,white_10%,transparent)] px-3 py-1 text-muted-foreground opacity-60"
                      title="PDF скоро"
                    >
                      <FileText className="h-3.5 w-3.5" /> PDF скоро
                    </button>
                    {a.journalUrl ? (
                      <a
                        href={a.journalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground"
                      >
                        Оригинал в журнале <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground/70">
                        Ссылка появится позже
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}