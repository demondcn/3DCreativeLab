export const SUGGESTED_PRODUCT_TAGS = ["Anime", "Videojuegos", "Geek", "Coleccionables", "Decoración", "Articulados", "Personalizados", "Regalos"];

export function normalizeProductTags(values: string[]) {
  const seen = new Set<string>();
  return values.map((value) => value.trim().replace(/\s+/g, " ")).filter((value) => {
    const key = value.toLocaleLowerCase("es");
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 12);
}
