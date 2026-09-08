import {getData, postData} from '@/network/http';
import {StaticInfo} from "@/StaticInfo";

export function fetch(vals:any) {
    return getData(1786, [vals.page,vals.orderCode,vals.company_name,vals.account_card,vals.project_name,vals.startDate,vals.endDate,vals.orderStatus,vals.moneyType,vals.pageSize,vals.supplierId,vals.foType,vals.paidStatus,vals.expenseCode,0]);
}
export function add(vals:any) {
    return postData(1782, [vals.orderCode,vals.orderDate,vals.accountId,vals.companyId,vals.paidAmount,vals.totalAmount,vals.moneyType,vals.projectId,vals.remark,vals.supplierId,vals.imgUrl,2,vals.bxId,vals.status],vals.jsonData);
}
export function edit(vals:any) {
    return postData(1783, [vals.uid,vals.orderCode,vals.orderDate,vals.accountId,vals.companyId,vals.paidAmount,vals.totalAmount,vals.moneyType,vals.projectId,vals.remark,vals.supplierId,vals.imgUrl,vals.bxId],vals.jsonData);
}
export function fenye(vals:any) {
    return getData(1787, [vals.orderCode,vals.company_name,vals.account_card,vals.project_name,vals.startDate,vals.endDate,vals.orderStatus,vals.moneyType,vals.pageSize,vals.supplierId,vals.foType,vals.paidStatus,vals.expenseCode,0]);
}
export function remove(vals:any) {
    return getData(1784, [vals]);
}
export function one(vals:any) {
    return getData(1785, [vals]);
}
// 审核/驳回统一接口：status 2=审核 15=驳回
export function check(vals:any) {
    return getData(1788, [vals.id, vals.status]);
}
// 一键审核
export function allReview() {
    return getData(1806, []);
}