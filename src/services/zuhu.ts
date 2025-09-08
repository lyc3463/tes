import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1154, [vals.page,vals.name,vals.phone,vals.pagecount]);
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
    return getData(1153, [vals]);
}
export function byzhuhu(vals:any) {
    return getData(1151, [vals.uid,vals.unit_id,vals.tenant_phone,vals.label_id=1,vals.reserved_amount,vals.warn_amount,vals.minimum_recharge,vals.is_deduction,vals.reamrk,vals.tenantAmount]);
}
export function fenye(vals:any) {
    return getData(1155, [vals.name,vals.phone,vals.pagecount]);
}
export function byfetch(vals:any) {
    return getData(1424, [vals.page,vals.name,vals.phone,vals.pagecount]);
}
export function byfenye(vals:any) {
    return getData(1425, [vals.name,vals.phone,vals.pagecount]);
}
export function jiebang(vals:any) {
    return getData(1423, [vals.page,vals.name,vals.phone]);
}
export function depoList(name:string,phone:string,startDate:string,endDate:string,uid:string,type:number) {
    return getData(1454, [name,phone,startDate,endDate,uid,type]);
}
export function editAbloue(vals:any) {
    return getData(1456, [vals.uid,vals.minimum_recharge]);
}
export function depoListFenye(name:string,phone:string,startDate:string,endDate:string,uid:string,type:number) {
    return getData(1455, [name,phone,startDate,endDate,uid,type]);
}
export function newbyzhuhu(vals:any) {
    return getData(1496, [vals.uid,vals.reserved_amount,vals.warn_amount,vals.minimum_recharge,vals.remark,vals.tenantAmount,vals.oldreserved_amount]);
}
export function newbyappuser(vals:any) {
    return getData(1423, [vals.uid,vals.tenant_phone,vals.is_deduction]);
}