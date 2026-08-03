import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1254, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize,0]);
}
export function add(vals:any) {
    return getData(1253, [vals.tenantId,vals.contractId,vals.name,vals.phone,vals.customCard,vals.imgList]);
}

export function edit(vals:any) {
    return getData(1545, [vals.uid,vals.rename,vals.rephone,vals.reCard,vals.imgList]);
}

export function remove(vals:any) {
    return getData(1546, [vals]);
}
export function check(vals:any) {
    return getData(1273, [vals]);
}
export function translation(vals:any) {
    return getData(1255, [vals.uid,vals.remark]);
}
export function one(vals:any) {
    return getData(1547, [vals]);
}

