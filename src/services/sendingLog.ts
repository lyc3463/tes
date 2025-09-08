import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1060, [vals.current,vals.phone,vals.starTime,vals.endTime,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1061, [vals.phone,vals.starTime,vals.endTime,vals.pageSize]);
}
export function fetchsms(vals:any) {
    return getData(1613, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.pageSize]);
}
export function fenyesms(vals:any) {
    return getData(1614, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.pageSize]);
}



