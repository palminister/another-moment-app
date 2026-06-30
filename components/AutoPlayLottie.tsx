"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

type AutoPlayLottieProps = {
  animationData: object;
  speed?: number;
  className?: string;
  ariaLabel?: string;
  onComplete?: () => void;
};

export function AutoPlayLottie({
  animationData,
  speed = 1,
  className,
  ariaLabel = "Animation",
  onComplete,
}: AutoPlayLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const animation: AnimationItem = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData,
    });

    animation.setSpeed(speed);

    if (onComplete) {
      animation.addEventListener("complete", onComplete);
    }

    return () => {
      if (onComplete) {
        animation.removeEventListener("complete", onComplete);
      }

      animation.destroy();
    };
  }, [animationData, onComplete, speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
    />
  );
}
