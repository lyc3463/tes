export const canEditOrDeleteInventory = (status: number): boolean =>
    status === 1 || status === 4;

export const canAuditInventory = (status: number): boolean => status === 3;

export const createInventoryRequestProduct = (product: any, inventoryRows: any[]) => {
    const stockRow = inventoryRows.find(row =>
        Number(row.productsId) === Number(product.id) && Number(row.unitsId) === Number(product.unitsId),
    );

    if (stockRow) {
        return {
            ...stockRow,
            productsId: Number(product.id),
            inventoryId: Number(stockRow.id),
            quantityKc: Number(stockRow.quantity || 0),
            quantity: 0,
        };
    }

    return {
        ...product,
        productsId: Number(product.id),
        inventoryId: 0,
        quantityKc: 0,
        quantity: 0,
        priceKc: 0,
    };
};