import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1759, [vals.page,vals.orderCode,vals.warehouseName,vals.startDate,vals.endDate,vals.orderStatus,vals.pageSize,vals.uName]);
}
export function fenye(vals:any) {
    return getData(1760, [vals.orderCode,vals.warehouseName,vals.startDate,vals.endDate,vals.orderStatus,vals.pageSize]);
}

export function add(vals:any) {
    return postData(1755, [vals.stockCode,vals.stockTime,vals.warehouseId,vals.remark],vals.jsonData);
}

export function edit(vals:any) {
    return postData(1756, [vals.uid,vals.stockCode,vals.stockTime,vals.warehouseId,vals.remark],vals.jsonData);
}

export function remove(vals:any) {
    return getData(1757, [vals]);
}
export function one(vals:any) {
    return getData(1758, [vals]);
}
export function check(vals:any) {
    return getData(1761, [vals,2]);
}

