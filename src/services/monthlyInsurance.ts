import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1538, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1539, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}