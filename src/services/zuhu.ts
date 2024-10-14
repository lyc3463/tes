import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1154, [vals.page,vals.name,vals.phone]);
}
export function add(vals:any) {
    // return getData(1117, [vals.collector_id,vals.water_type,vals.remark,vals.waterAddress,]);
}


export function edit(vals:any) {
    // return getData(1014, [vals.uid,vals.account_name,vals.account_card,vals.balance,vals.account_type,vals.company_id,vals.project_id]);
}

export function remove(vals:any) {
    // return getData(1050, [vals]);
}
export function one(vals:any) {
    // return getData(1013, [vals]);
}
