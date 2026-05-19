import { PageBack } from "@/components/page-back";
import { VariationNav } from "@/components/setup-variations/variation-nav";
import { ListClient } from "./list-client";

export const metadata = {
  title: "my setup — list — mihai crisan",
  description: "every tool, one line. hover for why.",
};

export default function SetupVariationThree() {
  return (
    <div className="mx-auto max-w-xl px-6 pt-12 pb-32">
      <div className="mb-16 flex items-center justify-between gap-6">
        <PageBack />
        <VariationNav current="3" />
      </div>

      <header className="mb-14">
        <h1 className="font-medium text-foreground text-lg tracking-tight">
          my setup
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          one line each. hover for why.
        </p>
      </header>

      <ListClient />
    </div>
  );
}
