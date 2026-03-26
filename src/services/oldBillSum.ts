import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1818, [vals.page,vals.orderNumber,vals.accountName,vals.startDate,vals.endDate,vals.pageSize,vals.createName]);
}
export function fenye(vals:any) {
    return getData(1819, [vals.orderNumber,vals.accountName,vals.startDate,vals.endDate,vals.pageSize,vals.createName]);
}