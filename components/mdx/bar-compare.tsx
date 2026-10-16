interface Metric {
  label: string;
  unit: string;
  values: { name: string; value: number }[];
}

interface BarCompareProps {
  metrics: Metric[];
  highlight?: string;
  caption?: string;
}

export function BarCompare({ metrics, highlight, caption }: BarCompareProps) {
  return (
    <figure className="my-10 space-y-6">
      {metrics.map((metric) => {
        const max = Math.max(...metric.values.map((v) => v.value));
        return (
          <div key={metric.label}>
            <span className="mb-2 block text-sm">{metric.label}</span>
            {metric.values.map((v) => (
              <div
                className="grid grid-cols-[6.5rem_1fr_4rem] items-center gap-3 font-mono text-xs leading-6"
                key={v.name}
              >
                <span className="text-muted-foreground">{v.name}</span>
                <span
                  className={`h-2 rounded-full ${v.name === highlight ? "bg-foreground" : "bg-muted-foreground/30"}`}
                  style={{ width: `${(v.value / max) * 100}%` }}
                />
                <span className="text-right tabular-nums">
                  {v.value} {metric.unit}
                </span>
              </div>
            ))}
          </div>
        );
      })}
      {caption && (
        <figcaption className="text-center text-muted-foreground text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
