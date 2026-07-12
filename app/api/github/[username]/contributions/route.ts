import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ username: string }>;
}

const CONTRIBUTION_LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const CALENDAR_QUERY = `
query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`;

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface CalendarResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: { contributionDays: ContributionDay[] }[];
        };
      };
    };
  };
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { username } = await params;

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "missing GITHUB_TOKEN" },
      { status: 503 }
    );
  }

  const res = await fetch("https://api.github.com/graphql", {
    body: JSON.stringify({
      query: CALENDAR_QUERY,
      variables: { login: username },
    }),
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `github graphql failed: ${res.status}` },
      { status: res.status }
    );
  }

  const json: CalendarResponse = await res.json();
  const weeks =
    json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

  if (!weeks) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const contributions = weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
    }))
  );

  return NextResponse.json(
    { contributions },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  );
}
