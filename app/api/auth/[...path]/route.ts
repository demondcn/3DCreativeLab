import { auth } from "@/lib/auth/server";

function unavailable() { return Response.json({ error: "Neon Auth no está configurado." }, { status: 503 }); }
const handlers = auth?.handler();
export const GET = handlers?.GET ?? unavailable;
export const POST = handlers?.POST ?? unavailable;
export const PUT = handlers?.PUT ?? unavailable;
export const PATCH = handlers?.PATCH ?? unavailable;
export const DELETE = handlers?.DELETE ?? unavailable;
