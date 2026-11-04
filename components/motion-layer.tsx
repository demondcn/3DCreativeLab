"use client";

import { useEffect } from "react";

export function MotionLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const selector = [
      ".hero-copy > *", ".station-card", ".custom-strip > *", ".section-heading > *",
      ".catalog-card", ".process-grid > li", ".custom-cta > *", ".site-footer > *",
      ".page-intro > *", ".catalog-tools", ".product-detail > *", ".custom-page > *",
    ].join(",");
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    nodes.forEach((node, index) => {
      node.dataset.reveal = "";
      node.style.setProperty("--reveal-delay", `${(index % 4) * 55}ms`);
    });
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.visible = "";
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    requestAnimationFrame(() => nodes.forEach((node) => observer.observe(node)));
    return () => { observer.disconnect(); document.documentElement.classList.remove("motion-ready"); };
  }, []);
  return null;
}

