import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1038, [vals.page,vals.billAbstract,vals.billBgeinTime,vals.billEndTime,vals.billStatus,vals.billMoneyType,vals.companyId,vals.projectId,vals.subjectId]);
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
    // return getData(1032, [vals]);
}

export function one(vals:string) {
    return getData(1039, [vals]);
}
export function check(vals:string) {
    return getData(1198, [vals]);
}
export function fenye(vals:any) {
    return getData(1092, [vals.billAbstract,vals.billBgeinTime,vals.billEndTime,vals.billStatus,vals.billMoneyType,vals.companyId,vals.projectId,vals.subjectId]);
}

