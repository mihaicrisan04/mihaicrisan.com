import { PageBack } from "@/components/page-back";
import { VariationNav } from "@/components/setup-variations/variation-nav";
import { PrinciplesClient } from "./principles-client";

export const metadata = {
  title: "my setup — principles — mihai crisan",
  description: "the rules i wrote so i wouldn't have to think.",
};

export default function SetupVariationFive() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-12 pb-32">
      <div className="mb-16 flex items-center justify-between gap-6">
        <PageBack />
        <VariationNav current="5" />
      </div>

      <header className="mb-20">
        <h1 className="font-medium text-foreground text-lg tracking-tight">
          my setup
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          the rules i wrote so i wouldn't have to think.
        </p>
      </header>

      <PrinciplesClient />
    </div>
  );
}
