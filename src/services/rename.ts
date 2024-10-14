import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1254, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}
export function add(vals:any) {
    return getData(1253, [vals.tenantId,vals.contractId,vals.name,vals.phone]);
}

export function edit(vals:any) {
    // return getData(1012, []);
}

export function remove(vals:any) {
    // return getData(1013, []);
}
export function fenye(vals:any) {
    return getData(1255, [vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}

