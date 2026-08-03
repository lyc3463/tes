import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1696, [vals.page,vals.name,vals.code,vals.pageSize,0]);
}
export function fenye(vals:any) {
    return getData(1697, [vals.name,vals.code,vals.pageSize,0]);
}

export function add(vals:any) {
    return postData(1692, [vals.productsName,vals.productsCode,vals.abbreviation,vals.productsImage,vals.brandId,vals.number,vals.presalePrice,vals.retailPricce,vals.costPrice,vals.specifications,vals.barcode='',vals.remark,vals.groupId,vals.unitsId,vals.isHs,vals.goodsTypeId,vals.yearId,vals.textureId],vals.jsonData);
}

export function edit(vals:any) {
    return postData(1693, [vals.uid,vals.productsName,vals.productsCode,vals.abbreviation,vals.productsImage,vals.brandId,vals.number,vals.presalePrice,vals.retailPricce,vals.costPrice,vals.specifications,vals.barcode='',vals.remark,vals.groupId,vals.unitsId,vals.isHs,vals.goodsTypeId,vals.yearId,vals.textureId],vals.jsonData);
}

export function remove(vals:any) {
    return getData(1694, [vals]);
}
export function one(vals:any) {
    return getData(1695, [vals]);
}

//导出
export function exportOk(validArea:number,valPwd:string,validTime:string) {
    return getData(2111, [validArea,valPwd,validTime]);
}
//导入
export function importOk(importKey:string,mm:string) {
    return postData(2112, [importKey,mm],'');
}


