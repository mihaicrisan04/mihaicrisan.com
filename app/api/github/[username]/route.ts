import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { username } = await params;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `github user fetch failed: ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();

  return NextResponse.json(
    {
      login: data.login,
      name: data.name,
      bio: data.bio,
      avatar_url: data.avatar_url,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  );
}
