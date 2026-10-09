export interface PurchaseUnitConversion {
    from_unit_id: number;
    to_unit_id: number;
    conversion_rate: number;
}

export interface PurchaseQuantityInput {
    quantity: number;
    price: number;
    unitsId: number;
    unitsList?: PurchaseUnitConversion[];
}

export interface PurchaseQuantityResult {
    quantity: number;
    price: number;
    unitsId: number;
}

export function convertPurchaseQuantity(input: PurchaseQuantityInput): PurchaseQuantityResult;
export function getPurchaseQuantityUpdate<T extends PurchaseQuantityInput & Record<string, any>>(
    item: T,
    quantity: number | null,
): T & PurchaseQuantityResult & { totalPrice: number };
export function mergePurchaseProductDetails<T extends Record<string, any>>(
    listProduct: T,
    detail: Partial<T> & { unitsList?: PurchaseUnitConversion[] },
): T & { unitsList: PurchaseUnitConversion[] };
export function getPurchaseUnitName(
    unitId: number,
    unitSettings?: Array<{ id: number; unitsName: string }>,
    fallback?: string,
): string;
export function hasPurchaseUnitConversions(isHs: number, unitsList?: PurchaseUnitConversion[]): boolean;
export function preservePurchaseUnitSelection<T extends { quantity: number; unitsId: number; price: number }>(
    item: T,
    unitsList: Array<PurchaseUnitConversion & { price?: number }>,
    fallbackUnitId: number,
): T & { totalPrice: number };