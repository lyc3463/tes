import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1771, [vals.page,vals.orderCode,vals.userName,vals.startDate,vals.endDate,vals.orderType,vals.ohType,vals.pageSize]);
}

export function fenye(vals:any) {
    return getData(1772, [vals.orderCode,vals.userName,vals.startDate,vals.endDate,vals.orderType,vals.ohType,vals.pageSize]);
}



