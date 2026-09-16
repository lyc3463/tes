import {getData, postData} from "@/network/http";

export function fetch(vals:any) {
    return getData(1858, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize,0]);
}
export function check(vals:any) {
    return getData(1859, [vals.uid,vals.auditRefundAmount,vals.serviceCharge, vals.orderNum, vals.reason, vals.renameStatus]);
}
export function one(vals:any) {
    return getData(1857, [vals.uid]);
}
export function refundNew(vals:any) {
    return postData(1854, [vals.tenantId,vals.applyAmount,vals.applyReason, vals.pdfImage, vals.orderId, vals.renameStatus], vals.jsonData);
}
export function refundEdit(vals:any) {
    return postData(1855, [vals.id,vals.applyAmount,vals.applyReason, vals.pdfImage, vals.orderId], vals.jsonData);
}
export function refundDelete(vals:any) {
    return postData(1856, [vals.id], vals.jsonData);
}
export function refundReturn(vals:any) {
    return postData(1860, [vals.id,vals.reason], vals.jsonData);
}