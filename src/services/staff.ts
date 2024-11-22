import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1239, [vals.page,vals.identifier,vals.contractType,vals.contractStatus,vals.startDate,vals.endDate]);
}

export function add(vals:any) {
    return postData(1235, [vals.identifier,vals.clientId,vals.customCard,vals.unit_id,vals.zuMoney,vals.manageFee,vals.deposit,vals.contractType=1,vals.startDate,vals.endDate],vals.jsonDate);
}

export function edit(vals:any) {
    return postData(1236, [vals.uid,vals.identifier,vals.clientId,vals.customCard,vals.unit_id,vals.zuMoney,vals.manageFee,vals.deposit,vals.contractType=1,vals.startDate,vals.endDate],vals.jsonDate);
}

export function remove(vals:any) {
    return getData(1237, [vals]);
}
export function one(vals:any) {
    return getData(1238, [vals]);
}
export function check(vals:any) {
    return getData(1241, [vals]);
}
export function fenye(vals:any) {
    return getData(1240, [vals.identifier,vals.contractType,vals.contractStatus,vals.startDate,vals.endDate]);
}


