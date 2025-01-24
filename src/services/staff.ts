import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1239, [vals.page,vals.identifier,vals.contractType,vals.contractStatus,vals.startDate,vals.endDate,vals.name]);
}

export function addzs(vals:any) {
    return postData(1235, [vals.identifier,vals.clientId,vals.customCard,vals.unit_id,vals.zuMoney,vals.manageFee,vals.deposit,vals.contractTypeid,vals.startDate,vals.endDate,vals.businessEntity,vals.businessScope,vals.deliveryDate,vals.decorationCost,vals.documentImage,vals.dispatchName,vals.dispatchCard,vals.unitImage,vals.imgs,vals.remark,vals.manageFeeRent,vals.house_id,vals.prepayment,vals.depositFee],vals.jsonDate);
}
export function adddj(vals:any) {
    return getData(1413, [vals.identifier,vals.clientId,vals.unit_id,vals.zuMoney,vals.deposit,vals.contractTypeid,vals.dayDate,vals.house_id]);
}

export function editzs(vals:any) {
    return postData(1236, [vals.uid,vals.identifier,vals.clientId,vals.customCard,vals.unit_id,vals.zuMoney,vals.manageFee,vals.deposit,vals.contractTypeid,vals.startDate,vals.endDate,vals.businessEntity,vals.businessScope,vals.deliveryDate,vals.decorationCost,vals.documentImage,vals.dispatchName,vals.dispatchCard,vals.unitImage,vals.imgs,vals.remark,vals.manageFeeRent,vals.house_id,vals.prepayment,vals.depositFee],vals.jsonDate);
}
export function editdj(vals:any) {
    return getData(1414, [vals.uid,vals.identifier,vals.clientId,vals.unit_id,vals.zuMoney,vals.deposit,vals.contractTypeid,vals.dayDate,vals.house_id]);
}

export function remove(vals:any) {
    return getData(1237, [vals]);
}
export function one(vals:any) {
    return getData(1238, [vals]);
}
export function check(vals:any) {
    return getData(1241, [vals.uid,vals.templateType]);
}
export function fenye(vals:any) {
    return getData(1240, [vals.identifier,vals.contractType,vals.contractStatus,vals.startDate,vals.endDate,vals.name]);
}
export function onedj(vals:any) {
    return getData(1415, [vals]);
}
export function oneOne(vals:any) {
    return getData(1416, [vals]);
}
