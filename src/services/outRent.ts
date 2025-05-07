import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1264, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}
export function add(vals:any) {
    return getData(1263, [vals.tenantId,vals.contractId,vals.startDate,vals.reason,vals.type]);
}
export function edit(vals:any) {
    return getData(1551, [vals.uid,vals.startDate,vals.refundReason]);
}

export function remove(vals:any) {
    return getData(1552, [vals]);
}
export function one(vals:any) {
    return getData(1553, [vals]);
}
export function fenye(vals:any) {
    return getData(1265, [vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}
export function check(vals:any) {
    return getData(1276, [vals]);
}