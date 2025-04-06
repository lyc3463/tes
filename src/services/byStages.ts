import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1270, [vals.page,vals.phone,vals.stutes,vals.startDate,vals.endDate]);
}
export function add(vals:any) {
    return getData(1269, [vals.tenantId,vals.contractId,vals.futureRent,vals.repaymentDate,vals.stages]);
}

export function edit(vals:any) {
    // return getData(1012, []);
}
export function check(vals:any) {
    return getData(1278, [vals]);
}
export function remove(vals:any) {
    // return getData(1013, []);
}
export function fenye(vals:any) {
    return getData(1271, [vals.phone,vals.stutes,vals.startDate,vals.endDate]);
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