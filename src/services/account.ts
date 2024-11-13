import {getData, postData} from '@/network/http';
// 查看特色列表
export function fetch(vals:any) {
    return getData(1012, [vals.name,vals.account_type]);
}
// 添加特色
export function add(vals:any) {
    return getData(1011, [vals.account_name,vals.account_card,vals.balance,vals.account_type,vals.company_id,vals.project_id]);
}


export function edit(vals:any) {
    return getData(1014, [vals.uid,vals.account_name,vals.account_card,vals.balance,vals.account_type,vals.company_id,vals.project_id]);
}

export function remove(vals:any) {
    return getData(1091, [vals]);
}
export function one(vals:any) {
    return getData(1013, [vals]);
}
