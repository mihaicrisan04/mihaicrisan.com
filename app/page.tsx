import Image from "next/image";
import Link from "next/link";
import { LinkGithub } from "@/components/home/link-github";
import { LinkSetup } from "@/components/home/link-setup";
import { LinkShimmer } from "@/components/home/link-shimmer";
import { LinkStrikethrough } from "@/components/home/link-strikethrough";
import { LinkWave } from "@/components/home/link-wave";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <div className="home relative flex h-svh w-full items-center justify-center overflow-hidden px-6">
      <div className="w-full max-w-md">
        <Reveal delay={0.05}>
          <h1 className="font-medium text-foreground text-lg tracking-tight">
            <span className="name inline-block cursor-default">
              mihai crisan
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 text-base text-muted-foreground leading-relaxed">
            software engineer based in cluj-napoca. currently building things at{" "}
            <LinkShimmer href="https://wolfpack-digital.com">
              wolfpack digital
            </LinkShimmer>
            , and doing a masters in software engineering at{" "}
            <LinkWave href="https://www.ubbcluj.ro/en/">
              bbu university
            </LinkWave>
            .
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            i care a lot about software in general, and lately a lot about ai.
            my <LinkSetup href="/setup">setup</LinkSetup> says a lot about me.
          </p>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            <Link
              className="inline-block bg-foreground text-background"
              href="/work"
            >
              /work
            </Link>{" "}
            for more.
          </p>
        </Reveal>

        <Reveal delay={0.42}>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            reach out on{" "}
            <LinkStrikethrough href="https://x.com/mihaicrisann">
              twitter
            </LinkStrikethrough>
            , or see what i&apos;m up to on{" "}
            <LinkGithub
              href="https://github.com/mihaicrisan04"
              usernames={["mihaicrisan04", "mihaicrisann"]}
            >
              github
            </LinkGithub>
            .
          </p>
        </Reveal>
      </div>

      <div
        aria-hidden
        className="avatar-peek pointer-events-none absolute right-[28%] bottom-0 z-0 origin-bottom"
      >
        <Image
          alt=""
          className="drop-shadow-xl"
          height={240}
          src="/avatar-cowboy.png"
          width={240}
        />
      </div>
    </div>
  );
}
