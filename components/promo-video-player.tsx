"use client";

import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface PromoVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

const CONTROLS_HIDE_DELAY = 2500;
const MORPH_TRANSITION = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function PromoVideoPlayer({
  src,
  poster,
  className,
}: PromoVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingId = useId();

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) {
      return;
    }
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => setTime(v.currentTime);
    const onLoadedMetadata = () => setDuration(v.duration || 0);
    const onVolumeChange = () => setMuted(v.muted);
    const onEnded = () => setPlaying(false);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("volumechange", onVolumeChange);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("volumechange", onVolumeChange);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, CONTROLS_HIDE_DELAY);
  }, []);

  // controls visibility lifecycle
  useEffect(() => {
    if (playing) {
      scheduleHide();
    } else {
      showControls();
    }
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [playing, scheduleHide, showControls]);

  // expanded-state side effects: scroll lock + escape
  useEffect(() => {
    if (!expanded) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
      }
    };
    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) {
      return;
    }
    setHasInteracted(true);
    if (v.paused) {
      v.play().catch(() => {
        /* autoplay blocked, no-op */
      });
    } else {
      v.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) {
      return;
    }
    v.muted = !v.muted;
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const seekToPointer = useCallback(
    (clientX: number, target: HTMLElement) => {
      const v = videoRef.current;
      if (!(v && duration)) {
        return;
      }
      const rect = target.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width)
      );
      v.currentTime = ratio * duration;
      setTime(v.currentTime);
    },
    [duration]
  );

  const handleSeekClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      seekToPointer(e.clientX, e.currentTarget);
    },
    [seekToPointer]
  );

  const handlePointerMove = useCallback(() => {
    showControls();
    if (playing) {
      scheduleHide();
    }
  }, [playing, scheduleHide, showControls]);

  const progress = useMemo(
    () => (duration > 0 ? Math.min(1, time / duration) : 0),
    [time, duration]
  );

  const showPlayOverlay = !playing;
  const cursorHidden = playing && !controlsVisible;

  return (
    <div className={cn("relative aspect-video w-full", className)}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="promo-backdrop"
            onClick={() => setExpanded(false)}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        aria-labelledby={headingId}
        className={cn(
          "group/player relative overflow-hidden bg-black",
          cursorHidden ? "cursor-none" : "cursor-default",
          expanded
            ? "fixed inset-0 z-50 m-auto aspect-video h-fit w-[min(calc(100vw-3rem),calc((100vh-3rem)*16/9))] shadow-2xl shadow-black/60"
            : "absolute inset-0"
        )}
        layout
        onMouseLeave={() => {
          if (playing) {
            setControlsVisible(false);
          }
        }}
        onMouseMove={handlePointerMove}
        role="region"
        transition={MORPH_TRANSITION}
      >
        <span className="sr-only" id={headingId}>
          Promo video
        </span>

        {/* biome-ignore lint/a11y/useMediaCaption: promo video, no captions track available */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          onClick={togglePlay}
          playsInline
          poster={poster}
          preload="metadata"
          ref={videoRef}
          src={src}
        />

        {/* paused / first-load overlay */}
        <AnimatePresence>
          {showPlayOverlay && (
            <motion.button
              animate={{ opacity: 1 }}
              aria-label={hasInteracted ? "Resume" : "Play promo"}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/10 via-black/0 to-black/30 outline-none"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="play-overlay"
              onClick={togglePlay}
              transition={{ duration: 0.2 }}
              type="button"
            >
              <motion.span
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/40 backdrop-blur-sm"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play
                  aria-hidden
                  className="h-5 w-5 translate-x-[1.5px] fill-current"
                />
              </motion.span>
              {!hasInteracted && (
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-white/70 text-xs uppercase tracking-[0.18em]"
                  initial={{ opacity: 0, y: 6 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                >
                  with sound
                </motion.span>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* bottom control bar */}
        <AnimatePresence>
          {controlsVisible && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
              exit={{ opacity: 0, y: 6 }}
              initial={{ opacity: 0, y: 6 }}
              key="controls"
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
              />

              <div className="pointer-events-auto relative px-4 pt-10 pb-3 sm:px-5">
                <button
                  aria-label="Seek"
                  className="group/seek relative block w-full cursor-pointer py-2"
                  onClick={handleSeekClick}
                  type="button"
                >
                  <div className="relative h-px w-full bg-white/25 transition-[height] duration-150 group-hover/seek:h-[2px]">
                    <div
                      className="absolute inset-y-0 left-0 bg-white"
                      style={{ width: `${progress * 100}%` }}
                    />
                    <div
                      aria-hidden
                      className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-150 group-hover/seek:opacity-100"
                      style={{
                        left: `calc(${progress * 100}% - 5px)`,
                      }}
                    />
                  </div>
                </button>

                <div className="mt-1 flex items-center gap-4 text-white">
                  <button
                    aria-label={playing ? "Pause" : "Play"}
                    className="flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-white"
                    onClick={togglePlay}
                    type="button"
                  >
                    {playing ? (
                      <Pause className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Play className="h-3.5 w-3.5 translate-x-[0.5px] fill-current" />
                    )}
                  </button>

                  <button
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-white"
                    onClick={toggleMute}
                    type="button"
                  >
                    {muted ? (
                      <VolumeX className="h-3.5 w-3.5" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <span className="font-mono text-[11px] text-white/70 tabular-nums tracking-tight">
                    <span className="text-white/90">{formatTime(time)}</span>
                    <span className="mx-1 text-white/30">/</span>
                    <span>{formatTime(duration)}</span>
                  </span>

                  <button
                    aria-label={expanded ? "Exit fullscreen" : "Expand"}
                    className="ml-auto flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-white"
                    onClick={toggleExpanded}
                    type="button"
                  >
                    {expanded ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
