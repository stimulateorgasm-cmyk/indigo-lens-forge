import { Star, ExternalLink } from "lucide-react";

interface Article {
  id: number;
  title: string;
  journal: string;
  authors: string;
  journalUrl?: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Метод биопсихосоциального программирования (БПСП)",
    journal: "Социальный психолог",
    authors: "Андрей Ковалев",
    journalUrl: "http://zi-kozlov.ru/magazines/scp/1576-scp-3-2025",
    featured: true,
  },
  {
    id: 2,
    title:
      "Результаты научных исследований по применению интегративного метода БПСП к коучинговым запросам",
    journal:
      "III Всероссийская научно-практическая конференция «Коучинг и наставничество: теория и практика»",
    authors: "Андрей Ковалев",
    journalUrl: "https://phsreda.com/ru/article/155032/discussion_platform",
    featured: true,
  },
  {
    id: 3,
    title: "Психокоррекция эмоционального выгорания с применением БПСП",
    journal: "Социальный психолог",
    authors: "Андрей Ковалев",
    journalUrl: "http://zi-kozlov.ru/magazines/scp/1516-scp-2-2024",
    featured: true,
  },
  {
    id: 4,
    title: "Психологические ограничения, связанные с деньгами",
    journal: "Социальный психолог",
    authors: "Андрей Ковалев, Анна Ковалева",
    journalUrl: "http://zi-kozlov.ru/magazines/scp/1533-scp-4-2024",
  },
  {
    id: 5,
    title: "Биопсихосоциальная модель преодоления фобий",
    journal: "Методология современной психологии",
    authors: "Андрей Ковалев, Артем Ваксер",
    journalUrl: "http://zi-kozlov.ru/collection/mctp/1614-method-2-2026",
  },
  {
    id: 6,
    title: "Биопсихосоциальный подход в психотерапии нарушения зрения",
    journal: "Методология современной психологии",
    authors: "Андрей Ковалев",
    journalUrl: "http://zi-kozlov.ru/collection/mctp/1515-method-2-2024",
  },
  {
    id: 7,
    title: "Биопсихосоциодуховная модель психотерапии",
    journal: "Социальный психолог",
    authors: "Андрей Ковалев",
    journalUrl: "http://zi-kozlov.ru/magazines/scp/1550-scp-1-2025",
  },
  {
    id: 8,
    title: "Духовные аспекты и подходы к психотерапии",
    journal: "Методология современной психологии",
    authors: "Андрей Ковалев",
    journalUrl: "http://zi-kozlov.ru/collection/mctp/1548-method-1-2025",
  },
  {
    id: 9,
    title: "Биопсихосоциальный подход в психотерапии расстройств пищевого поведения",
    journal: "Социальный психолог",
    authors: "Андрей Ковалев, Анна Ковалева",
    journalUrl: "http://zi-kozlov.ru/magazines/scp/1533-scp-4-2024",
  },
  {
    id: 10,
    title: "Сущность биопсихосоциальной адаптации к стрессу",
    journal: "Вестник интегративной психологии",
    authors: "Андрей Ковалев",
    journalUrl: "http://zi-kozlov.ru/magazines/vestnik/1517-vip-32-2024",
  },
];

export function ResearchSection() {
  return (
    <section id="research" className="relative px-6 py-16 md:py-20">
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
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {a.journal}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground md:text-base">
                    {a.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {a.authors}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
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