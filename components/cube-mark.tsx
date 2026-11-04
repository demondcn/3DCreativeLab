export function CubeMark({ className = "cube-mark" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={className} fill="none">
      <path d="m24 4 17 9.5v19L24 44 7 34V14L24 4Z" stroke="currentColor" strokeWidth="3" />
      <path d="m7 14 17 10 17-10M24 24v20" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

