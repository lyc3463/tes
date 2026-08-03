import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1843, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize,0]);
}
export function add(vals:any) {
    return postData(1839, [vals.selectTenantId,vals.remark,vals.imgList],vals.jsonData);
}
export function edit(vals:any) {
    return postData(1840, [vals.uid,vals.exemptReason,vals.imgList],vals.jsonData);
}
export function remove(vals:any) {
    return getData(1841, [vals]);
}
export function one(vals:any) {
    return getData(1842, [vals]);
}
export function check(vals:any) {
    return getData(1844, [vals]);
}
export function reject(vals:any) {
    return getData(1845, [vals.uid,vals.remark]);
}
