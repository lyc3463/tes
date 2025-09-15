import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1667, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.tenantId,vals.stutes,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1668, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.tenantId,vals.stutes,vals.pageSize]);
}
export function check(vals:any) {
    return getData(1666, [vals.uid,vals.status]);
}
export function remove(vals:any) {
    return getData(1665, [vals]);
}
export function reject(drId:number,stutes:number) {
    return getData(1669, [drId,stutes]);
}
