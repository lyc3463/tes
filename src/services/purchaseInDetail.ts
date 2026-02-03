import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1773, [vals.page,vals.orderCode,vals.productsName,vals.startDate,vals.endDate,vals.orderType,vals.iskc,vals.pageSize,vals.warehouseId,vals.unitId]);
}

export function fenye(vals:any) {
    return getData(1774, [vals.orderCode,vals.productsName,vals.startDate,vals.endDate,vals.orderType,vals.iskc,vals.pageSize,vals.warehouseId,vals.unitId]);
}



