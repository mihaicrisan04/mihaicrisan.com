const AGENTS = ["claude code", "codex", "t3 code"] as const;
const UPSTREAMS = ["linear:agency", "sentry:acme", "posthog:acme"] as const;
// The logo's 2x3 bay with two sockets plugged in.
const SOCKETS = [false, true, false, false, false, true] as const;

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 font-mono text-muted-foreground text-xs">
      {label && <span>{label}</span>}
      <span aria-hidden className="hidden sm:inline">
        ⟶
      </span>
      <span aria-hidden className="sm:hidden">
        ↓
      </span>
    </div>
  );
}

function Stack({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-md border border-border p-3">
      <span className="mb-2 block font-mono text-muted-foreground text-xs">
        {title}
      </span>
      {items.map((item) => (
        <span className="block font-mono text-sm leading-7" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Daemon() {
  return (
    <div className="rounded-md border-2 border-violet-500/60 p-3">
      <div className="mb-2 flex items-center gap-3">
        <div aria-hidden className="grid grid-cols-3 gap-1">
          {SOCKETS.map((plugged, i) => (
            <span
              className={`size-2 rounded-full ${plugged ? "bg-violet-500" : "border border-muted-foreground/60"}`}
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative grid
              key={i}
            />
          ))}
        </div>
        <span className="font-medium font-mono text-sm">plugbay daemon</span>
      </div>
      <span className="block font-mono text-muted-foreground text-xs leading-5">
        merges plugbay.toml
        <br />/ → project dir
      </span>
      <span className="mt-1 block font-mono text-muted-foreground text-xs leading-5">
        tokens from the keychain
      </span>
    </div>
  );
}

export function PlugbayFlow() {
  return (
    <figure className="my-10">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1.3fr_auto_1fr] sm:items-center">
        <Stack items={AGENTS} title="agents" />
        <Arrow label="stdio" />
        <Daemon />
        <Arrow label="shared" />
        <Stack items={UPSTREAMS} title="upstreams" />
      </div>
      <figcaption className="mt-3 text-center text-muted-foreground text-sm">
        one MCP entry per agent, one connection per server + account
      </figcaption>
    </figure>
  );
}
