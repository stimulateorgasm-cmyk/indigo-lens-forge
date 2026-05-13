import { WaveTransition } from "./WaveTransition";

export function AmplitudeSection() {
  return (
    <section id="amplitude" className="relative px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            От хаоса — к амплитуде
          </div>
          <h2
            className="font-semibold tracking-[-0.03em] text-gradient"
            style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", lineHeight: 1.1 }}
          >
            Стабилизация сигнала
          </h2>
        </div>
        <div className="rounded-3xl glass p-4 md:p-6">
          <WaveTransition />
          <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Хаос · турбулентность</span>
            <span>Амплитуда · синхронизация</span>
          </div>
        </div>
      </div>
    </section>
  );
}