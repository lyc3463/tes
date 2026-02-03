import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1775, [vals.page,vals.orderCode,vals.productsName,vals.startDate,vals.endDate,vals.orderType,vals.pageSize,vals.iskc,vals.warehouseId,vals.unitId]);
}

export function fenye(vals:any) {
    return getData(1776, [vals.orderCode,vals.productsName,vals.startDate,vals.endDate,vals.orderType,vals.pageSize,vals.iskc,vals.warehouseId,vals.unitId]);
}



