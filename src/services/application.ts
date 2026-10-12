import {getData, postData} from '@/network/http';
import { StaticInfo } from '@/StaticInfo';

export function fetch(vals:any) {
    return getData(1739, [vals.page,vals.orderCode,vals.warehouseName,vals.supplierName,vals.startDate,vals.endDate,vals.orderStatus,vals.billStatus,vals.pageSize,vals.orderType,vals.uName]);
}
export function fenye(vals:any) {
    return getData(1740, [vals.orderCode,vals.warehouseName,vals.supplierName,vals.startDate,vals.endDate,vals.orderStatus,vals.billStatus,vals.pageSize,vals.orderType]);
}

export function add(vals:any) {
    return postData(1735, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.supplierId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId,vals.orderStatus],vals.jsonData);
}

export function edit(vals:any) {
    return postData(1736, [vals.uid,vals.orderCode,vals.orderTime,vals.warehouseId,vals.supplierId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId],vals.jsonData);
}

export function remove(vals:any) {
    return getData(1737, [vals]);
}
// export function check(vals:any) {
//     return getData(1741, [vals.uid,vals.orderStatus]);
// }
export function check(vals:any) {
    return getData(1741, [vals.uid,vals.orderStatus, vals.Reason]);
}
export function one(vals:any) {
    return getData(1738, [vals]);
}
// export function addWarehousing(vals:any) {
//     return postData(1742, [vals.warehouseId],vals.jsonData);
// }
export function addWarehousing(vals:any) {
    return postData(1742, [vals.orderStatus],vals.jsonData);
}

// export function addOrType(vals:any) {
//     return postData(1745, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.supplierId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId],vals.jsonData);
// }
export function addOrType(vals:any) {
    return postData(1745, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.supplierId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId, vals.orderStatus],vals.jsonData);
}
// export function checkOrType(vals:any) {
//     return getData(1741, [vals.uid,vals.orderStatus]);
// }
export function checkOrType(vals:any) {
    return getData(1741, [vals.uid,vals.orderStatus, vals.Reason]);
}
// 入库审核
export function warehousingInspection(vals:any) {
    return getData(1744, [vals.checkWoCode,vals.checkStutes,vals.rejectReason]);
}
// 生成入库订单列表
export function orderList(vals:any) {
    return getData(2117, [vals.page,vals.orderCode,vals.woCode,vals.productsName,vals.startDate,vals.endDate,vals.unitsId,vals.warehouseId,vals.orderStatus,vals.pageSize,vals.userId, vals.supplierName]);
}
// 编辑入库单
export function editOrder(vals:any) {
    return postData(2118, [],vals);
}
// 删除入库单
export function deleteOrder(vals:any) {
    return getData(2119, [vals.woCode]);
}
// 直接送审采购单
export function sendCheck(vals:any) {
    return postData(2120, [vals.uid], vals.jsonData);
}
// 入库单送审
export function warehousingSendCheck(vals:any) {
    return getData(2121, [vals.checkWoCode,vals.checkStutes]);
}