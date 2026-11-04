"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return <main className="page-shell"><div className="empty-state"><h1>La línea está en pausa</h1><p>No pudimos consultar el catálogo en este momento. Tus datos no fueron sustituidos por información de demostración.</p><button className="button-dark" onClick={reset}>Reintentar</button></div></main>;
}
