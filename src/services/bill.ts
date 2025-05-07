import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1038, [vals.page,vals.billAbstract,vals.billBgeinTime,vals.billEndTime,vals.billStatus,vals.billMoneyType,vals.companyId,vals.projectId,vals.subjectId,vals.account_card,vals.pageSize]);
}
export function fetchNo(vals:any) {
    return getData(1482, [vals.billAbstract,vals.billBgeinTime,vals.billEndTime,vals.billStatus=0,vals.billMoneyType,vals.companyId,vals.projectId,vals.subjectId,vals.account_card,vals.pageSize=1000000]);
}
export function add(vals:any) {
    return getData(1035, [
        vals.billDate,
        vals.billAbstract,
        vals.billMoney,
        vals.money_type,
        vals.account_id,
        vals.company_id,
        vals.project_id,
        vals.subject_id,
        vals.number,
        vals.bill_status=0
    ]);
}
export function edit(vals:any) {
    return getData(1036, [
        vals.uid,
        vals.billDate,
        vals.billAbstract,
        vals.billMoney,
        vals.money_type,
        vals.account_id,
        vals.company_id,
        vals.project_id,
        vals.subject_id,
        vals.number,
        vals.bill_status
    ]);
}

export function remove(vals:any) {
    return getData(1037, [vals]);
}

export function one(vals:string) {
    return getData(1039, [vals]);
}
export function check(vals:string) {
    return getData(1198, [vals]);
}
export function allCheck() {
    return getData(1418, []);
}
export function fenye(vals:any) {
    return getData(1092, [vals.billAbstract,vals.billBgeinTime,vals.billEndTime,vals.billStatus,vals.billMoneyType,vals.companyId,vals.projectId,vals.subjectId,vals.account_card,vals.pageSize]);
}

