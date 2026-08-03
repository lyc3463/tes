import {getData} from "@/network/http";

export function fetch(vals:any) {
    return getData(1858, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize,0]);
}
export function check(vals:any) {
    return getData(1859, [vals.uid,vals.auditRefundAmount,vals.serviceCharge]);
}
export function one(vals:any) {
    return getData(1857, [vals.uid]);
}