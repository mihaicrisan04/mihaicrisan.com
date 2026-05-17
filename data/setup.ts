export interface SetupItem {
  name: string;
  note: string;
  href?: string;
}

export interface SetupGroup {
  title: string;
  items: SetupItem[];
}

export const setupGroups: SetupGroup[] = [
  {
    title: "machine",
    items: [
      { name: "macbook pro", note: "m-series, daily driver" },
      { name: "external display", note: "betterdisplay for fine control" },
    ],
  },
  {
    title: "editor",
    items: [
      { name: "zed", note: "daily editor", href: "https://zed.dev" },
      {
        name: "neovim",
        note: "remote / quick edits",
        href: "https://neovim.io",
      },
      { name: "cursor", note: "occasional", href: "https://cursor.com" },
      {
        name: "claude code",
        note: "agent in the terminal",
        href: "https://claude.com/claude-code",
      },
    ],
  },
  {
    title: "terminal",
    items: [
      { name: "ghostty", note: "terminal", href: "https://ghostty.org" },
      { name: "zsh + powerlevel10k", note: "shell + prompt" },
      { name: "eza", note: "ls replacement" },
      { name: "fzf", note: "fuzzy everything" },
      { name: "yazi", note: "file manager" },
      { name: "btop", note: "system monitor" },
      { name: "lazygit", note: "git tui" },
      { name: "lazydocker", note: "docker tui" },
    ],
  },
  {
    title: "cli",
    items: [
      { name: "bun", note: "js runtime + package manager" },
      { name: "mise", note: "tool versions + env" },
      { name: "ripgrep", note: "grep, but fast" },
      { name: "tldr", note: "man pages, simplified" },
      { name: "ollama", note: "local models" },
      { name: "stow", note: "symlink dotfiles" },
    ],
  },
  {
    title: "apps",
    items: [
      { name: "raycast", note: "launcher", href: "https://raycast.com" },
      {
        name: "karabiner-elements",
        note: "key remapping",
        href: "https://karabiner-elements.pqrs.org",
      },
      { name: "homerow", note: "keyboard mouse" },
      {
        name: "framer",
        note: "design + prototype",
        href: "https://framer.com",
      },
      { name: "figma", note: "design", href: "https://figma.com" },
      { name: "notchnook", note: "the notch, useful" },
      { name: "shottr", note: "screenshots" },
      { name: "beeper", note: "all messaging in one" },
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
