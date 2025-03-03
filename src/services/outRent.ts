import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1264, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}
export function add(vals:any) {
    return getData(1263, [vals.tenantId,vals.contractId,vals.startDate,vals.reason,vals.type=2]);
}
export function edit(vals:any) {
    // return getData(1012, []);
}

export function remove(vals:any) {
    // return getData(1013, []);
}
export function fenye(vals:any) {
    return getData(1265, [vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}
export function check(vals:any) {
    return getData(1276, [vals]);
}