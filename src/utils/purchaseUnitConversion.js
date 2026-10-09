function isIntegerQuantity(quantity) {
    return Math.abs(quantity - Math.round(quantity)) < 1e-10;
}

export function convertPurchaseQuantity({ quantity, price, unitsId, unitsList }) {
    let convertedQuantity = Number(quantity) || 0;
    let convertedPrice = Number(price) || 0;
    let convertedUnitsId = Number(unitsId) || 0;
    const conversions = Array.isArray(unitsList) ? unitsList : [];
    const visitedUnits = new Set();

    while (convertedUnitsId > 0 && !isIntegerQuantity(convertedQuantity) && !visitedUnits.has(convertedUnitsId)) {
        visitedUnits.add(convertedUnitsId);
        const conversion = conversions.find((item) => Number(item.from_unit_id) === convertedUnitsId);
        const rate = Number(conversion?.conversion_rate);
        const nextUnitsId = Number(conversion?.to_unit_id);

        if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(nextUnitsId) || nextUnitsId <= 0) {
            break;
        }

        convertedQuantity *= rate;
        convertedPrice /= rate;
        convertedUnitsId = nextUnitsId;
    }

    if (isIntegerQuantity(convertedQuantity)) {
        convertedQuantity = Math.round(convertedQuantity);
    }

    return {
        quantity: convertedQuantity,
        price: convertedPrice,
        unitsId: convertedUnitsId,
    };
}

export function getPurchaseQuantityUpdate(item, quantity) {
    const inputQuantity = Number(quantity) || 0;
    const converted = Number(item.isHs) === 1
        ? convertPurchaseQuantity({
            quantity: inputQuantity,
            price: item.price,
            unitsId: item.unitsId,
            unitsList: item.unitsList,
        })
        : {
            quantity: inputQuantity,
            price: Number(item.price) || 0,
            unitsId: Number(item.unitsId) || 0,
        };

    return {
        ...item,
        ...converted,
        totalPrice: Number((inputQuantity * (Number(item.price) || 0)).toFixed(2)),
    };
}

export function mergePurchaseProductDetails(listProduct, detail) {
    return {
        ...listProduct,
        ...detail,
        unitsList: Array.isArray(detail?.unitsList)
            ? detail.unitsList
            : Array.isArray(listProduct?.unitsList)
                ? listProduct.unitsList
                : [],
    };
}

export function getPurchaseUnitName(unitId, unitSettings, fallback = "") {
    const unit = Array.isArray(unitSettings)
        ? unitSettings.find((item) => Number(item.id) === Number(unitId))
        : undefined;
    return unit?.unitsName || fallback;
}

export function hasPurchaseUnitConversions(isHs, unitsList) {
    return Number(isHs) === 1 && Array.isArray(unitsList) && unitsList.length > 0;
}

export function preservePurchaseUnitSelection(item, unitsList, fallbackUnitId) {
    const unitsId = Number(item.unitsId) || Number(fallbackUnitId) || 0;
    const selectedUnit = Array.isArray(unitsList)
        ? unitsList.find((unit) => Number(unit.from_unit_id) === unitsId)
        : undefined;
    const price = Number(selectedUnit?.price ?? item.price ?? 0);
    const quantity = Number(item.quantity) || 0;

    return {
        quantity,
        unitsId,
        price,
        totalPrice: Number((quantity * price).toFixed(2)),
    };
}