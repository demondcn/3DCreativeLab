"use client";
export default function ProductsError({ reset }: { reset: () => void }) { return <main className="page-shell"><div className="empty-state"><h1>No pudimos cargar el catálogo</h1><p>Comprueba la conexión e inténtalo nuevamente.</p><button className="button-dark" onClick={reset}>Reintentar</button></div></main>; }
