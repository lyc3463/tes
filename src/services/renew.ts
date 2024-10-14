import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1261, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}
export function add(vals:any) {
    return getData(1260, [vals.tenantId,vals.contractId,vals.startDate,vals.endDate]);
}

export function edit(vals:any) {
    // return getData(1012, []);
}

export function remove(vals:any) {
    // return getData(1013, []);
}
export function fenye(vals:any) {
    return getData(1262, [vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}


