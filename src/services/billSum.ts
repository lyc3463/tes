import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1197, [vals.page,vals.billAbstract,vals.billBgeinTime,vals.billEndTime,vals.billStatus,vals.billMoneyType,vals.companyId,vals.projectId,vals.subjectId,vals.account_card]);
}
export function one(vals:string) {
    return getData(1039, [vals]);
}
export function fenye(vals:any) {
    return getData(1214, [vals.billAbstract,vals.billBgeinTime,vals.billEndTime,vals.billStatus,vals.billMoneyType,vals.companyId,vals.projectId,vals.subjectId,vals.account_card]);
}