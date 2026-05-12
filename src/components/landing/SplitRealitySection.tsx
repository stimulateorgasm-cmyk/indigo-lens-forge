import { GlassCard } from "./GlassCard";
import { WaveTransition } from "./WaveTransition";
import {
  Droplets,
  TrendingDown,
  BatteryLow,
  Activity,
  Zap,
  Shield,
} from "lucide-react";

const pain = [
  {
    icon: Droplets,
    title: "Текущая прибыль",
    body: "Тихие конфликты и саботаж в команде уносят до 30% маржи — незаметно, но систематически.",
  },
  {
    icon: TrendingDown,
    title: "Эрозия фокуса",
    body: "Лидер тратит ресурс на тушение пожаров вместо стратегии. Решения принимаются из истощения.",
  },
  {
    icon: BatteryLow,
    title: "Цена выгорания",
    body: "Личное выгорание собственника — самый дорогой невидимый актив. Цикл повторяется кварталами.",
  },
];

const solution = [
  {
    icon: Activity,
    title: "Диагностика глубины",
    body: "Карта психологических узлов компании за 3 сессии. Видим, где именно утекает прибыль.",
  },
  {
    icon: Zap,
    title: "Точечные интервенции",
    body: "Не тренинги, а инженерные изменения архитектуры решений. Эффект через 30 дней.",
  },
  {
    icon: Shield,
    title: "Устойчивая система",
    body: "Команда саморегулируется. Лидер возвращает 8+ часов в неделю на стратегию.",
  },
];

export function SplitRealitySection() {
  return (
    <section
      id="problem"
      className="relative px-6 py-32 md:py-44"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-16 md:mb-20 md:grid-cols-2 md:gap-24">
          {/* PAIN */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-50"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--pain) 35%, transparent), transparent)",
                filter: "blur(20px)",
              }}
            />
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[color-mix(in_oklab,var(--pain)_80%,white)]">
              Реальность
            </div>
            <h2
              className="font-semibold tracking-[-0.03em] text-gradient"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 1 }}
            >
              Цена
              <br />
              выгорания.
            </h2>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              То, что выглядит как операционные сложности — почти всегда симптом
              психологической перегрузки в ядре компании.
            </p>

            <div className="mt-10 space-y-4">
              {pain.map((p) => (
                <GlassCard key={p.title} tone="pain">
                  <div className="flex items-start gap-5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl glass">
                      <p.icon className="h-5 w-5 text-[color-mix(in_oklab,var(--pain)_85%,white)]" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-foreground">
                        {p.title}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* SOLUTION */}
          <div id="solution" className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-60"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--violet) 40%, transparent), transparent)",
                filter: "blur(24px)",
              }}
            />
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[color-mix(in_oklab,var(--cyan)_80%,white)]">
              Метод INDIGO
            </div>
            <h2
              className="font-semibold tracking-[-0.03em] text-gradient"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 1 }}
            >
              Стабилизация
              <br />
              сигнала.
            </h2>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              Превращаем хаотичную турбулентность в чистую амплитуду — где каждое
              решение синхронизировано с целью бизнеса.
            </p>

            <div className="mt-10 space-y-4">
              {solution.map((p) => (
                <GlassCard key={p.title} tone="solution">
                  <div className="flex items-start gap-5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl glass">
                      <p.icon className="h-5 w-5 text-[color-mix(in_oklab,var(--cyan)_70%,white)]" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-foreground">
                        {p.title}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Wave transition */}
        <div className="mt-12 rounded-3xl glass p-6 md:p-10">
          <WaveTransition />
          <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span>Хаос · турбулентность</span>
            <span>Амплитуда · синхронизация</span>
          </div>
        </div>
      </div>
    </section>
  );
}