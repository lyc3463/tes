import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1750, [vals.page,vals.orderCode,vals.warehouseName,vals.startDate,vals.endDate,vals.orderStatus,vals.billStatus,vals.pageSize,vals.orderType,vals.uName]);
}
export function fenye(vals:any) {
    return getData(1751, [vals.orderCode,vals.warehouseName,vals.startDate,vals.endDate,vals.orderStatus,vals.billStatus,vals.pageSize,vals.orderType]);
}
// 添加领用订单
export function add(vals:any) {
    return postData(1746, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.paidAmount,vals.totalAmount,vals.remark,0],vals.jsonData);
}
// 添加退货订单
export function addReturn(vals:any) {
    return postData(1753, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId],vals.jsonData);
}
// 添加调拨单
export function addTransfer(vals:any) {
    return postData(1763, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.remark,vals.warehouseId2],vals.jsonData);
}
// 添加损耗单
export function addDamage(vals:any) {
    return postData(1754, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.paidAmount,vals.totalAmount,vals.remark],vals.jsonData);
}
// 添加销售单
export function addSales(vals:any) {
    return postData(1762, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.remark,vals.paidAmount,vals.totalAmount,vals.customerId,vals.discountRate,vals.discountPrice,vals.pmId,vals.salesperson],vals.jsonData);
}
export function edit(vals:any) {
    return postData(1747, [vals.uid,vals.orderCode,vals.orderTime,vals.warehouseId,vals.paidAmount,vals.totalAmount,vals.remark,vals.warehouseId2,vals.customerId,vals.discountRate,vals.discountPrice,vals.pmId,vals.salesperson],vals.jsonData);
}

export function remove(vals:any) {
    return getData(1748, [vals]);
}
export function one(vals:any) {
    return getData(1749, [vals]);
}
export function check(vals:any) {
    return getData(1752, [vals,2]);
}
export function payment(vals:any) {
    return getData(1765, [vals.uid,vals.paymentAmount,vals.paymentType,vals.payCrderCode,vals.payOrderType]);
}



