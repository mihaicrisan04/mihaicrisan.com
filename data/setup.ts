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
      { name: "macbook pro m1", note: "still works fine to this day" },
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
        note: "main ai",
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
        name: "cmux",
        note: "terminal",
        href: "https://github.com/manaflow-ai/cmux",
      },
      { name: "dia", note: "browser", href: "https://www.diabrowser.com" },
      { name: "shottr", note: "screenshots", href: "https://shottr.cc" },
      { name: "zed", note: "code editor", href: "https://zed.dev" },
      { name: "cursor", note: "ai code editor", href: "https://cursor.com" },
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
