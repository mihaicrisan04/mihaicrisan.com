import { PageBack } from "@/components/page-back";
import { VariationNav } from "@/components/setup-variations/variation-nav";
import { ParagraphClient } from "./paragraph-client";

export const metadata = {
  title: "my setup — paragraph — mihai crisan",
  description: "what's on this machine, in a few sentences.",
};

export default function SetupVariationTwo() {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-xl flex-col px-6 pt-12 pb-24">
      <div className="mb-16 flex items-center justify-between gap-6">
        <PageBack />
        <VariationNav current="2" />
      </div>

      <h1 className="mb-10 font-medium text-foreground text-lg tracking-tight">
        my setup
      </h1>

      <ParagraphClient />
    </div>
  );
}
