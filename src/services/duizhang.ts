import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1200, [vals.page,vals.name,vals.startDate,vals.endDate]);
}

export function add(vals:any) {
    return getData(1199, [vals.accountId,vals.reconBalance]);
}
export function fenye(vals:any) {
    return getData(1201, [vals.name,vals.startDate,vals.endDate]);
}