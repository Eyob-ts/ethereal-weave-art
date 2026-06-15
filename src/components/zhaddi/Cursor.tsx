import { useEffect, useRef } from "react";

/** Golden cursor: a precise dot with a trailing ring that grows over links. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 3.5}px, ${my - 3.5}px)`;
      const target = e.target as HTMLElement;
      const interactive = !!target.closest("a, button, input, select, textarea, [data-cursor]");
      ring.style.width = interactive ? "60px" : "38px";
      ring.style.height = interactive ? "60px" : "38px";
      ring.style.opacity = "1";
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      const w = parseFloat(ring.style.width || "38");
      ring.style.transform = `translate(${rx - w / 2}px, ${ry - w / 2}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="zhaddi-cursor-ring" style={{ opacity: 0 }} />
      <div ref={dotRef} className="zhaddi-cursor-dot" />
    </>
  );
}
