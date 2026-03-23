"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { TextMarqueeProps } from "@/types";

export function TextMarquee({
  text,
  className,
}: TextMarqueeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [play, setPlay] = useState(true);
  const timerRef = useRef<number | null>(null);
  const isPausingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const update = () => {
      setIsOverflow(measure.scrollWidth > container.clientWidth - 30);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(measure);

    return () => ro.disconnect();
  }, [text]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const maskStyle = useMemo<React.CSSProperties>(() => {
    const fp = Math.max(0, 25);
    const gradient = `linear-gradient(90deg,
      rgba(0,0,0,0) 0px,
      rgba(0,0,0,1) ${fp}px,
      rgba(0,0,0,1) calc(100% - ${fp}px),
      rgba(0,0,0,0) 100%
    )`;

    return {
      position: "relative",
      overflow: "hidden",
      WebkitMaskImage: gradient,
      maskImage: gradient,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
    };
  }, []);

  const handleCycleComplete = () => {
    if (isPausingRef.current) return;

    isPausingRef.current = true;
    setPlay(false);

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setPlay(true);
      isPausingRef.current = false;
      timerRef.current = null;
    }, 5000);
  };

  return (
    <div ref={containerRef} className={className} style={maskStyle}>
      <span
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {text}
      </span>

      {isOverflow ? (
        <Marquee
          direction="left"
          speed={50}
          loop={0}
          play={play}
          gradient={false}
          onCycleComplete={handleCycleComplete}
        >
          <span
            style={{
              paddingLeft: 25,
              paddingRight: 50,
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {text}
          </span>
        </Marquee>
      ) : (
        <span
          style={{
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            paddingLeft: 25,
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
}
