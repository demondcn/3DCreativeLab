"use client";
import { deleteProduct } from "@/app/admin/actions";
export function DeleteProductButton({ id, name }: { id: string; name: string }) { return <form action={deleteProduct} onSubmit={(event) => { if (!window.confirm(`¿Eliminar ${name}? Esta acción no se puede deshacer.`)) event.preventDefault(); }}><input type="hidden" name="id" value={id} /><button className="text-button danger">Eliminar</button></form>; }
