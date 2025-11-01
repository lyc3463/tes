import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1267, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}
export function add(vals:any) {
    return getData(1266, [vals.tenantId,vals.contractId,vals.discountMoney,vals.startDate,vals.endDate,vals.youhuiType]);
}

export function edit(vals:any) {
    return getData(1506, [vals.uid,vals.preRen,vals.startDate,vals.endDate,vals.preType]);
}
export function check(vals:any) {
    return getData(1277, [vals]);
}
export function remove(vals:any) {
    return getData(1507, [vals]);
}
export function fenye(vals:any) {
    return getData(1268, [vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}
export function one(vals:any) {
    return getData(1514, [vals]);
}
// 缴费确定
export function payment(vals:any) {
    return getData(1764, [vals.uid,vals.paymentAmount,vals.paymentType]);
}



