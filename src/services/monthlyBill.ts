import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1250, [vals.page,vals.name,vals.type,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1251, [vals.name,vals.type,vals.startDate,vals.endDate]);
}
