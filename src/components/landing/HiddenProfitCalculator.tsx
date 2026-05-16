import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/track";

const formatRub = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);

const LOSS_RATE = 0.15; // средний процент потерь от выгорания/конфликтов

export function HiddenProfitCalculator() {
  const [team, setTeam] = useState(30);
  const [salary, setSalary] = useState(150_000);

  const loss = useMemo(() => Math.round(team * salary * LOSS_RATE), [team, salary]);

  const scrollToForm = () => {
    track("cta_click", { source: "calculator" });
    track("calculator_use", { team, salary, loss });
    document
      .getElementById("lead-bottom")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="calculator" className="relative px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Калькулятор
          </div>
          <h2
            className="mt-3 font-semibold tracking-[-0.02em] text-gradient"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.05 }}
          >
            Сколько компания теряет каждый месяц
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Усреднённая оценка потерь от выгорания, конфликтов и низкой
            вовлечённости — 15% фонда оплаты труда.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-[28px] glass-strong p-6 md:p-10"
          style={{ boxShadow: "var(--shadow-glass)" }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Slider
              label="Размер команды"
              value={team}
              onChange={setTeam}
              min={5}
              max={500}
              step={1}
              format={(v) => `${v} чел.`}
            />
            <Slider
              label="Средняя зарплата, ₽"
              value={salary}
              onChange={setSalary}
              min={50_000}
              max={500_000}
              step={5_000}
              format={(v) => formatRub(v)}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-[color-mix(in_oklab,var(--magenta)_30%,transparent)] bg-[color-mix(in_oklab,var(--magenta)_8%,transparent)] p-6 text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Скрытые потери в месяц
            </div>
            <div
              className="mt-2 font-semibold italic text-gradient"
              style={{
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                lineHeight: 1.05,
                background: "var(--gradient-cta)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                backgroundSize: "200% 200%",
                animation: "shimmer 14s linear infinite",
              }}
            >
              ≈ {formatRub(loss)}
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              className="mt-6 inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-medium text-foreground/90 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Записаться на сессию
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

function Slider({ label, value, onChange, min, max, step, format }: SliderProps) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span className="text-base font-medium text-foreground">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-[color-mix(in_oklab,white_8%,transparent)] accent-[var(--magenta)]"
        style={{
          background: `linear-gradient(to right, var(--magenta) 0%, var(--magenta) ${((value - min) / (max - min)) * 100}%, color-mix(in oklab, white 8%, transparent) ${((value - min) / (max - min)) * 100}%, color-mix(in oklab, white 8%, transparent) 100%)`,
        }}
      />
    </label>
  );
}