import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1851, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize,0]);
}
export function add(vals:any) {
    return postData(1847, [vals.selectTenantId,vals.phoneOld,vals.phoneNew,vals.phoneReason,vals.imgList],'');
}
export function edit(vals:any) {
    return postData(1848, [vals.uid,vals.phoneOld,vals.phoneNew,vals.phoneReason,vals.imgList],'');
}
export function remove(vals:any) {
    return getData(1849, [vals]);
}
export function one(vals:any) {
    return getData(1850, [vals]);
}
export function check(vals:any) {
    return getData(1852, [vals]);
}
export function reject(vals:any) {
    return getData(1853, [vals.uid,vals.remark]);
}
