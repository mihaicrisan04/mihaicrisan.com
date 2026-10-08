"use client";

import { useLazyComponent } from "@/hooks/use-lazy-component";

interface PromoVideoPlayerLazyProps {
  src: string;
  poster?: string;
}

const loadPlayer = () =>
  import("./promo-video-player").then((m) => m.PromoVideoPlayer);

// Server renders the poster frame; the full player (motion, custom controls)
// swaps in after hydration.
export function PromoVideoPlayerLazy({
  src,
  poster,
}: PromoVideoPlayerLazyProps) {
  const Player = useLazyComponent(loadPlayer);

  if (Player) {
    return <Player poster={poster} src={src} />;
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {/* biome-ignore lint/a11y/useMediaCaption: promo video, no captions track available */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        poster={poster}
        preload="metadata"
        src={src}
      />
    </div>
  );
}
