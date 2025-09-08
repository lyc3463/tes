import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1565, [vals.page,vals.address,vals.remark,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1566, [vals.address,vals.remark,vals.pageSize]);
}
export function checkLog(vals:any) {
    return getData(1653, [vals.page,vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}
export function checkLogFenye(vals:any) {
    return getData(1654, [vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}