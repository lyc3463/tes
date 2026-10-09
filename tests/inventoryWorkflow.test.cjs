const assert = require('node:assert/strict');
const test = require('node:test');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
    const source = require('node:fs').readFileSync(filename, 'utf8');
    const output = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    module._compile(output, filename);
};

const {
    canEditOrDeleteInventory,
    canAuditInventory,
    createInventoryRequestProduct,
} = require('../src/utils/inventoryWorkflow.ts');

test('only draft and rejected inventory requests can be edited or deleted', () => {
    assert.deepEqual([1, 2, 3, 4].map(canEditOrDeleteInventory), [true, false, false, true]);
});

test('only submitted inventory requests can be audited', () => {
    assert.deepEqual([1, 2, 3, 4].map(canAuditInventory), [false, false, true, false]);
});

test('adding a catalog item absent from the selected warehouse defaults its stock to zero', () => {
    const product = {
        id: 24,
        productsName: '备用灯泡',
        productsCode: 'P-024',
        productsImage: 'bulb',
        unitsId: 2,
        unitsName: '个',
        quantity: 19,
        price: 5,
    };

    assert.deepEqual(
        createInventoryRequestProduct(product, []),
        {
            ...product,
            productsId: 24,
            inventoryId: 0,
            quantityKc: 0,
            quantity: 0,
            priceKc: 0,
        },
    );
});