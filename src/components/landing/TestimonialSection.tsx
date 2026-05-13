import maximPhoto from "@/assets/testimonial-maxim.jpg";

export function TestimonialSection() {
  return (
    <section id="testimonial" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
        <div className="relative mx-auto md:mx-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 -z-10 rounded-full"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--magenta) 45%, transparent), transparent 70%)",
              filter: "blur(30px)",
              animation: "halo-pulse 7s ease-in-out infinite",
            }}
          />
          <div
            className="relative h-56 w-56 overflow-hidden rounded-full md:h-64 md:w-64"
            style={{
              boxShadow:
                "inset 0 0 0 1px color-mix(in oklab, white 18%, transparent), 0 30px 80px -20px color-mix(in oklab, var(--violet) 60%, transparent)",
            }}
          >
            <img
              src={maximPhoto}
              alt="Максим Чёрный — владелец дизайн-студии Artum"
              width={768}
              height={768}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <figure>
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            История клиента
          </div>
          <blockquote
            className="text-balance italic text-foreground"
            style={{
              fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}
          >
            «Когда руководитель выходит из этой синусоиды, он перестаёт тратить
            ресурс на борьбу с собой. У него освобождается энергия на стратегию
            и рост.»
          </blockquote>
          <figcaption className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Максим Чёрный</span> ·
            владелец дизайн-студии Artum и онлайн-школы дизайна Маши Чёрной
          </figcaption>
        </figure>
      </div>
    </section>
  );
}