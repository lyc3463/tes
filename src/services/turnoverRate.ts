import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1779, [vals.page,vals.orderCode,vals.productsName,vals.startDate,vals.endDate,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1780, [vals.orderCode,vals.productsName,vals.startDate,vals.endDate,vals.pageSize]);
}




