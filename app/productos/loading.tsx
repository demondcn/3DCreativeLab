export default function Loading() { return <main className="page-shell"><div className="page-intro"><h1>Cargando catálogo…</h1></div><div className="catalog-grid" aria-hidden="true">{[1,2,3,4].map((item) => <div key={item} className="catalog-skeleton" />)}</div></main>; }

