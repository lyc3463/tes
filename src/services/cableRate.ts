import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1355, [vals.page,vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.recordStatus,vals.remark,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1356, [vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.recordStatus,vals.remark,vals.pageSize]);
}
export function upDload(vals:any) {
    return getData(1679, [vals.page,vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.recordStatus,vals.remark,vals.pageSize]);
}
// 旧电表扣费记录
export function oldFetch(vals:any) {
    return getData(1677, [vals.page,vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.recordStatus,vals.remark,vals.pageSize]);
}
// 旧电表扣费记录分页
export function oldFenye(vals:any) {
    return getData(1678, [vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.recordStatus,vals.remark,vals.pageSize]);
}