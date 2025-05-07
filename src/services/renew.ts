import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1261, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}
export function add(vals:any) {
    return getData(1260, [vals.tenantId,vals.contractId,vals.startDate,vals.endDate]);
}

export function edit(vals:any) {
    return getData(1548, [vals.uid,vals.startDate,vals.endDate]);
}

export function remove(vals:any) {
    return getData(1549, [vals]);
}
export function fenye(vals:any) {
    return getData(1262, [vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}
export function check(vals:any) {
    return getData(1275, [vals]);
}

export function one(vals:any) {
    return getData(1550, [vals]);
}