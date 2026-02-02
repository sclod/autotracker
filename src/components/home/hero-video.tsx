"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HeroVideoProps = {
  className?: string;
};

export function HeroVideo({ className }: HeroVideoProps) {
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowMotion(!media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return (
    <video
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_35%] max-md:object-[50%_0%]",
        className
      )}
      autoPlay={allowMotion}
      muted
      loop={allowMotion}
      playsInline
      controls={false}
      disablePictureInPicture
      controlsList="nodownload noplaybackrate noremoteplayback"
      preload="metadata"
      poster="/placeholders/hero.jpg"
      aria-hidden="true"
    >
      <source src="/main_video.mp4" type="video/mp4" />
    </video>
  );
}
