import { Mail, MessageCircle, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { IndigoLogo } from "./IndigoLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color-mix(in_oklab,white_8%,transparent)] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <IndigoLogo size={32} />
              <span className="text-sm font-medium tracking-tight text-foreground">
                Indigo Lab
                <span className="ml-2 text-muted-foreground">· Психология бизнеса</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Indigo Method — доказательная программа развития команд и руководителей.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Навигация</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <a href="#method" className="text-muted-foreground transition-colors hover:text-foreground">Метод</a>
              <a href="#research" className="text-muted-foreground transition-colors hover:text-foreground">Исследования</a>
              <a href="#calculator" className="text-muted-foreground transition-colors hover:text-foreground">Калькулятор прибыли</a>
              <a href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
              <a href="#lead-top" className="text-muted-foreground transition-colors hover:text-foreground">Записаться</a>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Контакты</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="mailto:info@indigolab.pro"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                info@indigolab.pro
              </a>
              <a
                href="https://t.me/andreyIndigo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Send className="h-4 w-4" />
                Telegram Андрея Индиго
              </a>
              <a
                href="https://t.me/coachfor1mln"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                Открытый чат Indigo Lab
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Документы</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                to="/privacy"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Политика конфиденциальности
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-[color-mix(in_oklab,white_8%,transparent)] pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Indigo Lab. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
