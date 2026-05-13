import { IndigoLogo } from "./IndigoLogo";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full glass px-5 py-3 md:mt-6 md:px-7">
        <a href="#top" className="flex items-center gap-3">
          <IndigoLogo size={32} />
          <span className="text-sm font-medium tracking-tight text-foreground">
            Indigo Lab
            <span className="ml-2 text-muted-foreground">· Психология бизнеса</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#method">Метод</a>
          <a className="transition-colors hover:text-foreground" href="#amplitude">Амплитуда</a>
          <a className="transition-colors hover:text-foreground" href="#testimonial">Отзыв</a>
          <a className="transition-colors hover:text-foreground" href="#research">Исследования</a>
        </nav>
        <a
          href="#lead-top"
          className="inline-flex items-center rounded-full hairline px-4 py-2 text-sm text-foreground transition-colors hover:bg-[color-mix(in_oklab,white_6%,transparent)]"
        >
          Записаться
        </a>
      </div>
    </header>
  );
}