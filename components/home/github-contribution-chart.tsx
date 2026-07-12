"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";

interface Activity {
  date: string;
  count: number;
  level: number;
}

interface ApiResponse {
  total: Record<string, number>;
  contributions: Activity[];
}

interface GithubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
}

const contributionsCache = new Map<string, Activity[]>();
const userCache = new Map<string, GithubUser>();

async function fetchFromOwnApi(username: string): Promise<Activity[]> {
  const res = await fetch(`/api/github/${username}/contributions`);
  if (!res.ok) {
    throw new Error(`github contributions: ${res.status}`);
  }
  const json: { contributions: Activity[] } = await res.json();
  return json.contributions;
}

async function fetchFromJogruber(username: string): Promise<Activity[]> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
  );
  if (!res.ok) {
    throw new Error(`github contributions: ${res.status}`);
  }
  const json: ApiResponse = await res.json();
  return json.contributions;
}

async function fetchContributions(username: string): Promise<Activity[]> {
  const cached = contributionsCache.get(username);
  if (cached) {
    return cached;
  }
  const contributions = await fetchFromOwnApi(username).catch(() =>
    fetchFromJogruber(username)
  );
  contributionsCache.set(username, contributions);
  return contributions;
}

async function fetchUser(username: string): Promise<GithubUser> {
  const cached = userCache.get(username);
  if (cached) {
    return cached;
  }
  const res = await fetch(`/api/github/${username}`);
  if (!res.ok) {
    throw new Error(`github user: ${res.status}`);
  }
  const json: GithubUser = await res.json();
  userCache.set(username, json);
  return json;
}

const LIGHT_THEME = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const DARK_THEME = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

function buildPlaceholder(weeks: number): Activity[] {
  const days = weeks * 7;
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (days - 1));
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { date: d.toISOString().slice(0, 10), count: 0, level: 0 };
  });
}

interface GithubContributionChartProps {
  username: string;
  weeks?: number;
}

export function GithubContributionChart({
  username,
  weeks = 20,
}: GithubContributionChartProps) {
  const { resolvedTheme } = useTheme();
  const [data, setData] = useState<Activity[] | null>(
    contributionsCache.get(username) ?? null
  );
  const [user, setUser] = useState<GithubUser | null>(
    userCache.get(username) ?? null
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchContributions(username)
      .then((d) => {
        if (!cancelled) {
          setData(d);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      });
    fetchUser(username)
      .then((u) => {
        if (!cancelled) {
          setUser(u);
        }
      })
      .catch(() => {
        /* avatar/bio are optional */
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (error) {
    return (
      <div className="font-mono text-muted-foreground text-xs">
        couldn&apos;t load contributions
      </div>
    );
  }

  const isLoading = !data;
  const trimmed = data ? data.slice(-weeks * 7) : buildPlaceholder(weeks);

  return (
    <div className="flex flex-col gap-2.5">
      <div className={isLoading ? "animate-pulse" : undefined}>
        <ActivityCalendar
          blockMargin={2}
          blockRadius={2}
          blockSize={8}
          colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
          data={trimmed}
          fontSize={10}
          showColorLegend={false}
          showMonthLabels={false}
          showTotalCount={false}
          theme={{ light: LIGHT_THEME, dark: DARK_THEME }}
          weekStart={1}
        />
      </div>
      <GithubUserRow user={user} username={username} />
    </div>
  );
}

function GithubUserRow({
  user,
  username,
}: {
  user: GithubUser | null;
  username: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-border/50 border-t pt-2.5">
      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted">
        {user?.avatar_url && (
          <Image
            alt={user.login}
            className="object-cover"
            fill
            sizes="28px"
            src={user.avatar_url}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-medium text-foreground text-xs">
          @{user?.login ?? username}
        </span>
        {user ? (
          <span className="truncate text-[11px] text-muted-foreground">
            {user.bio ?? user.name ?? `github.com/${user.login}`}
          </span>
        ) : (
          <span className="h-3 w-24 animate-pulse rounded bg-muted" />
        )}
      </div>
    </div>
  );
}
