export const dynamic = "force-static";

const content = `# mihai crisan

> software engineer based in cluj-napoca, romania. currently building things at wolfpack digital and studying computer science at babeș-bolyai university. cares a lot about software in general, and lately a lot about AI.

## about

- fullstack software developer at [wolfpack digital](https://wolfpack-digital.com) since july 2025 — scalable web applications with a deep focus on design and user experience
- previously freelance fullstack developer (since december 2024)
- computer science student at [babeș-bolyai university](https://www.ubbcluj.ro/en/), cluj-napoca

## projects

- [zalem](https://mihaicrisan.com/work/zalem): AI-native ecommerce shop — a grounded shopping advisor that never invents product data (bachelor thesis)
- [busu cluj](https://mihaicrisan.com/work/busu-cluj): live bus tracking for cluj-napoca — native iOS app with a realtime Convex backend
- [mihaicrisan.com](https://mihaicrisan.com/work/mihaicrisan-com): this site — a portfolio with a built-in AI assistant (zuzu) backed by a Convex RAG pipeline
- [rent'n go](https://mihaicrisan.com/work/rentn-go): full-stack car rental platform for romania — booking, transfers, admin dashboard
- [quik](https://mihaicrisan.com/work/quik): inline AI prompt for your zsh session — Cmd+Enter, ask, streams in place. written in Rust
- [airdrop CLI](https://mihaicrisan.com/work/airdrop): AirDrop files and URLs from the macOS terminal
- [WhatsApp bookmark](https://mihaicrisan.com/work/whatsapp-bookmark): Raycast extension that turns WhatsApp into a personal bookmarking inbox
- [nara](https://mihaicrisan.com/work/nara): document Q&A platform — upload PDFs, get grounded answers with cited sources
- [mihai și alesia](https://mihaicrisan.com/work/mihai-si-alesia): a tiny photo gallery — scattered polaroid prints, built as a gift

## links

- [work](https://mihaicrisan.com/work): all projects
- [setup](https://mihaicrisan.com/setup): tools and gear
- [cv](https://mihaicrisan.com/cv.pdf): resume (PDF)
- [github](https://github.com/mihaicrisan04)
- [twitter](https://x.com/mihaicrisann)
`;

export function GET() {
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
