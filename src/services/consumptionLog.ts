import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1452, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID]);
}
export function fenye(vals:any) {
    return getData(1453, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID]);
}
