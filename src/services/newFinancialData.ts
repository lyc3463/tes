import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1786, [vals.page,vals.orderCode,vals.company_name,vals.account_card,vals.project_name,vals.startDate,vals.endDate,vals.orderStatus,vals.moneyType,vals.pageSize]);
}
export function add(vals:any) {
    return postData(1782, [vals.orderCode,vals.orderDate,vals.accountId,vals.companyId,vals.paidAmount,vals.totalAmount,vals.moneyType,vals.projectId,vals.remark],vals.jsonData);
}
export function edit(vals:any) {
    return postData(1783, [vals.uid,vals.orderCode,vals.orderDate,vals.accountId,vals.companyId,vals.paidAmount,vals.totalAmount,vals.moneyType,vals.projectId,vals.remark],vals.jsonData);
}
export function fenye(vals:any) {
    return getData(1787, [vals.orderCode,vals.company_name,vals.account_card,vals.project_name,vals.startDate,vals.endDate,vals.orderStatus,vals.moneyType,vals.pageSize]);
}
export function remove(vals:any) {
    return getData(1784, [vals]);
}
export function one(vals:any) {
    return getData(1785, [vals]);
}
export function check(vals:any) {
    return getData(1788, [vals,2]);
}