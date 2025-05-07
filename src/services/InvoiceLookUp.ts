import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1352, [vals.page,vals.name,vals.stutes,vals.openID,vals.pageSize]);
}

export function edit(vals:any) {
    return getData(1349, [vals.uid,vals.rise_type,vals.rise_name,vals.duty_paragraph,vals.phone,vals.is_default,vals.bankDeposit,vals.bankCard,vals.work_phone,vals.work_address,vals.email]);
}

export function remove(vals:any) {
    return getData(1350, [vals]);
}
export function one(vals:any) {
    return getData(1351, [vals]);
}
export function fenye(vals:any) {
    return getData(1353, [vals.name,vals.stutes,vals.openID,vals.pageSize]);
}
export function check(vals:any) {
    return getData(1354, [vals.uid,vals.stutes=2]);
}
