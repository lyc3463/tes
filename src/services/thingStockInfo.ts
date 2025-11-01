import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1743, [vals.page,vals.warehouseId,vals.productsName,vals.startDate,vals.endDate,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1744, [vals.warehouseId,vals.productsName,vals.startDate,vals.endDate,vals.pageSize]);
}



