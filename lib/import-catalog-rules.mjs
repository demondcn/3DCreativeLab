export function expectedCatalogPrice(productType) {
  if (productType === "Llavero") return 8000;
  if (productType === "Arte de pared") return 40000;
  if (productType === "Posavasos") return 35000;
  return 20000;
}

export function catalogClassificationErrors({ external_id, product_type, tags, price }) {
  const errors = [];
  if (product_type === "Otro") errors.push(`${external_id}: el tipo Otro no está permitido.`);
  if (tags.includes("Clicker") && product_type !== "Llavero") errors.push(`${external_id}: un clicker debe clasificarse como Llavero.`);
  const expected = expectedCatalogPrice(product_type);
  if (price !== expected) errors.push(`${external_id}: el precio ${price} no corresponde al tipo ${product_type}; se esperaba ${expected}.`);
  return errors;
}
