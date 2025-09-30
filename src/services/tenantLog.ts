import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1675, [vals.page,vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1676, [vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}