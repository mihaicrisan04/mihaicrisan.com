export interface SetupItem {
  name: string;
  note: string;
  href?: string;
}

export interface SetupGroup {
  title: string;
  items: SetupItem[];
  footer?: string;
}

export const setupGroups: SetupGroup[] = [
  {
    title: "hardware",
    items: [
      { name: "macbook pro m5 pro", note: "daily driver" },
      { name: "airpods", note: "a must" },
    ],
  },
  {
    title: "cli",
    items: [
      { name: "mise", note: "goated", href: "https://mise.jdx.dev" },
      { name: "bun", note: "js runtime + pm", href: "https://bun.com" },
      { name: "brew", note: "goated", href: "https://brew.sh" },
      {
        name: "claude code",
        note: "main ai, runs in t3 code",
        href: "https://claude.com/claude-code",
      },
      { name: "codex", note: "", href: "https://github.com/openai/codex" },
      { name: "yazi", note: "file manager", href: "https://yazi-rs.github.io" },
    ],
    footer: "plus custom cli apps + widgets, all in the dotfiles.",
  },
  {
    title: "apps",
    items: [
      { name: "raycast", note: "the goat", href: "https://raycast.com" },
      {
        name: "rex",
        note: "terminal by superlogical",
        href: "https://superlogical.com",
      },
      {
        name: "t3 code",
        note: "agentic development",
        href: "https://github.com/pingdotgg/t3code",
      },
      { name: "zed", note: "when i need to see code", href: "https://zed.dev" },
      { name: "dia", note: "browser", href: "https://www.diabrowser.com" },
      { name: "shottr", note: "screenshots", href: "https://shottr.cc" },
      {
        name: "yaak",
        note: "postman alternative",
        href: "https://yaak.app",
      },
      {
        name: "datagrip",
        note: "database ide",
        href: "https://www.jetbrains.com/datagrip",
      },
      {
        name: "thaw",
        note: "bartender alternative",
        href: "https://github.com/stonerl/Thaw",
      },
      { name: "lookaway", note: "eye breaks", href: "https://lookaway.app" },
      {
        name: "betterdisplay",
        note: "display config",
        href: "https://github.com/waydabber/BetterDisplay",
      },
      {
        name: "karabiner",
        note: "keyboard remap",
        href: "https://karabiner-elements.pqrs.org",
      },
      {
        name: "screen studio",
        note: "screen recording",
        href: "https://screen.studio",
      },
      {
        name: "homerow",
        note: "keyboard mouse",
        href: "https://homerow.app",
      },
    ],
  },
  {
    title: "dotfiles",
    items: [
      {
        name: "github.com/mihaicrisan04/dotfiles",
        note: "everything, stowed",
        href: "https://github.com/mihaicrisan04/dotfiles",
      },
    ],
  },
];
