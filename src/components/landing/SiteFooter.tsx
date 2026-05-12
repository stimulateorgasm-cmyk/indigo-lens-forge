import { IndigoLogo } from "./IndigoLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color-mix(in_oklab,white_8%,transparent)] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-3">
          <IndigoLogo size={24} />
          <span>Indigo Lab · Психология бизнеса</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#contact" className="transition-colors hover:text-foreground">Контакт</a>
          <a href="#problem" className="transition-colors hover:text-foreground">Метод</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}