import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1739, [vals.page,vals.orderCode,vals.warehouseName,vals.supplierName,vals.startDate,vals.endDate,vals.orderStatus,vals.billStatus,vals.pageSize,vals.orderType]);
}
export function fenye(vals:any) {
    return getData(1740, [vals.orderCode,vals.warehouseName,vals.supplierName,vals.startDate,vals.endDate,vals.orderStatus,vals.billStatus,vals.pageSize,vals.orderType]);
}

export function add(vals:any) {
    return postData(1735, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.supplierId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId],vals.jsonData);
}

export function edit(vals:any) {
    return postData(1736, [vals.uid,vals.orderCode,vals.orderTime,vals.warehouseId,vals.supplierId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId],vals.jsonData);
}

export function remove(vals:any) {
    return getData(1737, [vals]);
}
export function check(vals:any) {
    return getData(1741, [vals,2]);
}
export function one(vals:any) {
    return getData(1738, [vals]);
}
export function addWarehousing(vals:any) {
    return getData(1742, [vals.warehouseId,vals.jsonId]);
}

export function addOrType(vals:any) {
    return postData(1745, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.supplierId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId],vals.jsonData);
}
