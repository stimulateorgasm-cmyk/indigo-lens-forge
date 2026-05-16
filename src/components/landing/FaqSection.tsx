import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { track } from "@/lib/track";

const faqs = [
  {
    q: "Сколько длится программа?",
    a: "Базовый цикл — 8 недель. Включает диагностику, серию рабочих сессий с командой и индивидуальные встречи с лидером. Точный график подбираем под ритм компании.",
  },
  {
    q: "Сколько это стоит?",
    a: "Стоимость рассчитываем индивидуально — она зависит от размера команды и глубины запроса. На бесплатной диагностике (45 минут) обсуждаем задачи и присылаем коммерческое предложение в течение 2 рабочих дней.",
  },
  {
    q: "В каком формате проходит работа?",
    a: "Смешанный формат: онлайн-сессии для регулярной работы и 1–2 очные встречи в Москве (или вашем городе) на ключевых этапах. Всё гибко подстраивается под расписание.",
  },
  {
    q: "Когда увидим первые результаты?",
    a: "Первые сдвиги в коммуникации и атмосфере команды клиенты замечают через 2–3 недели. Измеримое влияние на бизнес-показатели — обычно к концу второго месяца.",
  },
  {
    q: "С кем именно мы работаем?",
    a: "Программу ведёт основатель Indigo Lab и закреплённый партнёр-психолог. На сложных запросах подключаем профильных экспертов из команды.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Вопросы
          </div>
          <h2
            className="mt-3 font-semibold tracking-[-0.02em] text-gradient"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.05 }}
          >
            Часто спрашивают
          </h2>
        </div>

        <div
          className="rounded-[24px] glass p-2 md:p-4"
          style={{ boxShadow: "var(--shadow-glass)" }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(value) => {
              if (value) {
                const idx = Number(value.replace("item-", ""));
                track("faq_open", { index: idx, question: faqs[idx]?.q });
              }
            }}
          >
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-[color-mix(in_oklab,white_8%,transparent)] last:border-b-0"
              >
                <AccordionTrigger className="px-4 py-5 text-left text-base font-medium hover:no-underline md:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5 text-sm text-muted-foreground md:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}