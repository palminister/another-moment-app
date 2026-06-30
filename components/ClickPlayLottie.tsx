"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

type ClickPlayLottieProps = {
  animationData: object;
  playSignal: number;
  speed?: number;
  scale?: number;
  className?: string;
  ariaLabel?: string;
};

export function ClickPlayLottie({
  animationData,
  playSignal,
  speed = 1,
  scale = 1,
  className,
  ariaLabel = "Animation",
}: ClickPlayLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData,
    });

    animation.setSpeed(speed);
    animationRef.current = animation;

    return () => {
      animation.destroy();
      animationRef.current = null;
    };
  }, [animationData, speed]);

  useEffect(() => {
    if (playSignal === 0) {
      return;
    }

    animationRef.current?.setSpeed(speed);
    animationRef.current?.goToAndPlay(0, true);
  }, [playSignal, speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{ "--lottie-scale": scale } as React.CSSProperties}
    />
  );
}
