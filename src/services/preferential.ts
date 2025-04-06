import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1267, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}
export function add(vals:any) {
    return getData(1266, [vals.tenantId,vals.contractId,vals.preRen]);
}

export function edit(vals:any) {
    // return getData(1012, []);
}
export function check(vals:any) {
    return getData(1277, [vals]);
}
export function remove(vals:any) {
    return getData(1507, [vals]);
}
export function fenye(vals:any) {
    return getData(1268, [vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}


