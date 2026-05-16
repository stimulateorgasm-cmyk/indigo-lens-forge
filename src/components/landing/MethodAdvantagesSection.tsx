import {
  Stethoscope,
  Target,
  Globe,
  Layers,
  FlaskConical,
  Crosshair,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { GlassCard } from "./GlassCard";

interface Item {
  icon: LucideIcon;
  title: string;
  body: string;
}

const items: Item[] = [
  {
    icon: Stethoscope,
    title: "Диагностика предшествует работе",
    body: "Перед интервенцией — карта психологических узлов. Не вмешиваемся вслепую.",
  },
  {
    icon: Target,
    title: "Работа с причинами",
    body: "Не симптомы и поведение, а корневые установки и сценарии.",
  },
  {
    icon: Globe,
    title: "Холистическое восприятие",
    body: "Лидер, команда и бизнес — единая система. Меняем её целиком.",
  },
  {
    icon: Layers,
    title: "Интегративный подход",
    body: "Совмещаем когнитивные, телесные и системные методы под задачу.",
  },
  {
    icon: FlaskConical,
    title: "Научная опора",
    body: "Опираемся на доказательную базу, а не на тренд или интуицию.",
  },
  {
    icon: Crosshair,
    title: "Конкретизация запросов",
    body: "Переводим абстрактные «хочу легче» в измеримые поведенческие изменения.",
  },
  {
    icon: TrendingUp,
    title: "Ориентация на результат",
    body: "Метрика — изменение в работе и прибыли, а не количество сессий.",
  },
];

export function MethodAdvantagesSection() {
  return (
    <section id="method" className="relative px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Метод Indigo Lab
          </div>
          <h2
            className="font-semibold tracking-[-0.03em] text-gradient"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)", lineHeight: 1.05 }}
          >
            Биопсихосоциальный подход отличается от традиционной психологии тем, что:
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((it) => (
            <AdvantageCard key={it.title} item={it} />
          ))}
          <div className="sm:col-span-2 lg:col-span-3">
            <AdvantageCard item={items[6]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AdvantageCard({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <GlassCard tone="solution" className="h-full">
      <div className="flex items-start gap-5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl glass">
          <Icon className="h-5 w-5 text-[color-mix(in_oklab,var(--cyan)_70%,white)]" />
        </div>
        <div>
          <div className="text-base font-medium text-foreground">{item.title}</div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {item.body}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}