import { PageBack } from "@/components/page-back";
import { VariationNav } from "@/components/setup-variations/variation-nav";
import { ManifestFile } from "./manifest-file";

export const metadata = {
  title: "my setup — manifest — mihai crisan",
  description: "the bits below are the only ones i bring with me to a new mac.",
};

export default function SetupVariationOne() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-12 pb-24">
      <div className="mb-12 flex items-center justify-between gap-6">
        <PageBack />
        <VariationNav current="1" />
      </div>

      <header className="mb-10">
        <h1 className="font-medium text-foreground text-lg tracking-tight">
          my setup
        </h1>
        <p className="mt-2 font-mono text-muted-foreground/60 text-xs">
          ~/.config/mihai/setup.toml
        </p>
      </header>

      <ManifestFile />
    </div>
  );
}
