import { PageBack } from "@/components/page-back";
import { VariationNav } from "@/components/setup-variations/variation-nav";
import { KeymapClient } from "./keymap-client";

export const metadata = {
  title: "my setup — keymap — mihai crisan",
  description: "the bindings between my hands and the work.",
};

export default function SetupVariationFour() {
  return (
    <div className="mx-auto max-w-xl px-6 pt-12 pb-32">
      <div className="mb-16 flex items-center justify-between gap-6">
        <PageBack />
        <VariationNav current="4" />
      </div>

      <header className="mb-14">
        <h1 className="font-medium text-foreground text-lg tracking-tight">
          my setup
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          the bindings between my hands and the work. one modifier, the rest is
          muscle memory.
        </p>
      </header>

      <KeymapClient />
    </div>
  );
}
