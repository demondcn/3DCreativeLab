export function expectedCatalogPrice(productType: string): number;
export function catalogClassificationErrors(row: { external_id: string; product_type: string; tags: string[]; price: number }): string[];
