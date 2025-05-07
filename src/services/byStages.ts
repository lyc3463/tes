import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1270, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}
export function add(vals:any) {
    return getData(1269, [vals.tenantId,vals.contractId,vals.futureRent,vals.fqStartDate,vals.fqEndDate,vals.hkStartDate,vals.hkEndDate]);
}

export function edit(vals:any) {
    return getData(1508, [vals.uid,vals.futureRent,vals.fqStartDate,vals.fqEndDate,vals.hkStartDate,vals.hkEndDate]);
}
export function check(vals:any) {
    return getData(1278, [vals]);
}
export function remove(vals:any) {
    return getData(1509, [vals]);
}
export function fenye(vals:any) {
    return getData(1271, [vals.phone,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}

export function bydian(uid:any,jsondata:string) {
    return postData(1431, [uid],jsondata);
}
export function byshui(vals:any,jsondata:string) {
    return postData(1432, [vals],jsondata);
}
export function byItem(vals:any) {
    return getData(1479, [vals.uid,vals.item_id]);
}
export function one(vals:any) {
    return getData(1515, [vals]);
}