import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1789, [vals.page,vals.numBerOrder,vals.company_name,vals.account_card,vals.project_name,vals.startDate,vals.endDate,vals.moneyType,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1790, [vals.numBerOrder,vals.company_name,vals.account_card,vals.project_name,vals.startDate,vals.endDate,vals.moneyType,vals.pageSize]);
}