import { PageBack } from "@/components/page-back";
import { SetupList } from "@/components/setup-list";
import { setupGroups } from "@/data/setup";

export const metadata = {
  title: "my setup — mihai crisan",
  description: "what i use, daily.",
};

export default function SetupPage() {
  const total = setupGroups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="mx-auto max-w-xl px-6 pt-12 pb-24">
      <div className="mb-12 flex items-center justify-between">
        <PageBack />
        <span className="font-mono text-muted-foreground/60 text-xs">
          {String(total).padStart(2, "0")} items
        </span>
      </div>

      <header className="mb-12">
        <h1 className="mb-2 font-medium text-foreground text-xl tracking-tight">
          my setup
        </h1>
        <p className="font-mono text-base text-muted-foreground">
          tools, apps, and configs i actually use. everything else is in{" "}
          <a
            className="text-muted-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
            href="https://github.com/mihaicrisan04/dotfiles"
            rel="noopener noreferrer"
            target="_blank"
          >
            the dotfiles
          </a>
          .
        </p>
      </header>

      <SetupList groups={setupGroups} />
    </div>
  );
}
