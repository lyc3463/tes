import {getData, postData} from '@/network/http';
import {StaticInfo} from "@/StaticInfo";

export function fetch(vals:any) {
    return getData(1743, [vals.page,vals.warehouseId,vals.productsName,vals.startDate,vals.endDate,vals.pageSize,vals.unitId]);
}
export function fenye(vals:any) {
    return getData(1744, [vals.warehouseId,vals.productsName,vals.startDate,vals.endDate,vals.pageSize,vals.unitId]);
}
export function selectFetch(warehouseId) {
    return getData(1791, [warehouseId,'','2000-01-01','2099-01-01',StaticInfo.park_id]);
}
// 根据物品名字查询库存列表
export function productsNameQuery(warehouseId,productsName) {
    return getData(1794, [warehouseId,productsName,StaticInfo.park_id]);
}
// 编辑价钱
export function editProductsPrice(vals:any) {
    return getData(1744, [vals.uid,vals.presalePrice,vals.retailPricce]);
}
