const assert = require("node:assert/strict");
const { test } = require("node:test");
const {
    convertPurchaseQuantity,
    getPurchaseQuantityUpdate,
    mergePurchaseProductDetails,
    getPurchaseUnitName,
    preservePurchaseUnitSelection,
    hasPurchaseUnitConversions,
} = require("./purchaseUnitConversion.js");

test("only shows a unit selector when conversion is enabled and relations exist", () => {
    assert.equal(hasPurchaseUnitConversions(1, []), false);
    assert.equal(hasPurchaseUnitConversions(1, [{ from_unit_id: 1, to_unit_id: 2 }]), true);
    assert.equal(hasPurchaseUnitConversions(0, [{ from_unit_id: 1, to_unit_id: 2 }]), false);
});

test("resolves the selected unit name from the unit settings", () => {
    assert.equal(
        getPurchaseUnitName(12, [{ id: 12, unitsName: "箱" }], ""),
        "箱",
    );
});

test("uses unit conversions from product detail when the list item has none", () => {
    const unitsList = [{ from_unit_id: 1, to_unit_id: 2, conversion_rate: 10 }];
    const result = mergePurchaseProductDetails(
        { id: 8, productsName: "Tea", unitsId: 1 },
        { costPrice: 20, isHs: 1, unitsList },
    );

    assert.deepEqual(result, {
        id: 8,
        productsName: "Tea",
        unitsId: 1,
        costPrice: 20,
        isHs: 1,
        unitsList,
    });

    assert.deepEqual(
        getPurchaseQuantityUpdate({ ...result, price: 100 }, 0.2),
        {
            ...result,
            quantity: 2,
            price: 10,
            totalPrice: 20,
            unitsId: 2,
            isHs: 1,
        },
    );
});

test("applies unit conversion as part of the quantity input update", () => {
    const result = getPurchaseQuantityUpdate({
        id: 1,
        quantity: 1,
        price: 100,
        totalPrice: 100,
        unitsId: 1,
        isHs: 1,
        unitsList: [
            { from_unit_id: 1, to_unit_id: 2, conversion_rate: 10 },
            { from_unit_id: 2, to_unit_id: 3, conversion_rate: 10 },
        ],
    }, 0.02);

    assert.deepEqual(result, {
        id: 1,
        quantity: 2,
        price: 1,
        totalPrice: 2,
        unitsId: 3,
        isHs: 1,
        unitsList: [
            { from_unit_id: 1, to_unit_id: 2, conversion_rate: 10 },
            { from_unit_id: 2, to_unit_id: 3, conversion_rate: 10 },
        ],
    });
});

test("converts a fractional quantity down the unit chain until it is an integer", () => {
    const result = convertPurchaseQuantity({
        quantity: 0.02,
        price: 100,
        unitsId: 1,
        unitsList: [
            { from_unit_id: 1, to_unit_id: 2, conversion_rate: 10 },
            { from_unit_id: 2, to_unit_id: 3, conversion_rate: 10 },
        ],
    });

    assert.deepEqual(result, { quantity: 2, price: 1, unitsId: 3 });
});

test("keeps integer quantities in the selected unit", () => {
    const result = convertPurchaseQuantity({
        quantity: 2,
        price: 5,
        unitsId: 1,
        unitsList: [{ from_unit_id: 1, to_unit_id: 2, conversion_rate: 10 }],
    });

    assert.deepEqual(result, { quantity: 2, price: 5, unitsId: 1 });
});

test("keeps a fractional quantity at the minimum unit", () => {
    const result = convertPurchaseQuantity({
        quantity: 0.5,
        price: 4,
        unitsId: 2,
        unitsList: [{ from_unit_id: 1, to_unit_id: 2, conversion_rate: 10 }],
    });

    assert.deepEqual(result, { quantity: 0.5, price: 4, unitsId: 2 });
});

test("does not convert a fractional quantity without a conversion chain", () => {
    const result = convertPurchaseQuantity({
        quantity: 0.5,
        price: 4,
        unitsId: 1,
        unitsList: [],
    });

    assert.deepEqual(result, { quantity: 0.5, price: 4, unitsId: 1 });
});

test("preserves the entered quantity and selected unit when detail data arrives late", () => {
    const result = preservePurchaseUnitSelection(
        { quantity: 4, unitsId: 2, price: 5, totalPrice: 20 },
        [
            { from_unit_id: 1, price: 50 },
            { from_unit_id: 2, price: 5 },
        ],
        1,
    );

    assert.deepEqual(result, {
        quantity: 4,
        unitsId: 2,
        price: 5,
        totalPrice: 20,
    });
});

test("does not convert quantities for products with conversion disabled", () => {
    const result = getPurchaseQuantityUpdate({
        quantity: 0,
        price: 100,
        totalPrice: 0,
        unitsId: 1,
        isHs: 0,
        unitsList: [{ from_unit_id: 1, to_unit_id: 2, conversion_rate: 10 }],
    }, 0.5);

    assert.deepEqual(result, {
        quantity: 0.5,
        price: 100,
        totalPrice: 50,
        unitsId: 1,
        isHs: 0,
        unitsList: [{ from_unit_id: 1, to_unit_id: 2, conversion_rate: 10 }],
    });
});