import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1162, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1163, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate]);
}
