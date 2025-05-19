import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1239, [vals.page,vals.identifier,vals.contractType,vals.contractStatus,vals.startDate,vals.endDate,vals.name,vals.pageSize]);
}

export function addzs(vals:any) {
    return postData(1235, [vals.identifier,vals.clientId,vals.customCard,vals.unit_id,vals.zuMoney,vals.manageFee,vals.deposit,vals.contractTypeid,vals.startDate,vals.endDate,vals.businessEntity,vals.businessScope,vals.deliveryDate,vals.decorationCost,vals.documentImage,vals.dispatchName,vals.dispatchCard,vals.unitImage,vals.imgs,vals.remark,vals.manageFeeRent,vals.house_id,vals.prepayment,vals.depositFee,vals.legalPerson],vals.jsonDate);
}
export function adddj(vals:any) {
    return getData(1413, [vals.identifier,vals.clientId,vals.unit_id,vals.zuMoney,vals.deposit,vals.dayDate,vals.house_id,vals.contractType]);
}

export function editzs(vals:any) {
    return postData(1236, [vals.uid,vals.identifier,vals.clientId,vals.customCard,vals.unit_id,vals.zuMoney,vals.manageFee,vals.deposit,vals.contractTypeid,vals.startDate,vals.endDate,vals.businessEntity,vals.businessScope,vals.deliveryDate,vals.decorationCost,vals.documentImage,vals.dispatchName,vals.dispatchCard,vals.unitImage,vals.imgs,vals.remark,vals.manageFeeRent,vals.house_id,vals.prepayment,vals.depositFee,vals.legalPerson],vals.jsonDate);
}
export function editdj(vals:any) {
    return getData(1414, [vals.uid,vals.identifier,vals.clientId,vals.unit_id,vals.zuMoney,vals.deposit,vals.dayDate,vals.house_id]);
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
    return getData(1240, [vals.identifier,vals.contractType,vals.contractStatus,vals.startDate,vals.endDate,vals.name,vals.pageSize]);
}
export function onedj(vals:any) {
    return getData(1415, [vals]);
}
export function oneOne(uid:any,templateType:any) {
    return getData(1416, [uid,templateType]);
}
export function getHT(vals:any) {
    return getData(1490, [vals.page,vals.identifier,vals.contractType,vals.contractStatus,vals.startDate,vals.endDate,vals.name,vals.pageSize]);
}
export function getHTfFy(vals:any) {
    return getData(1491, [vals.identifier,vals.contractType,vals.contractStatus,vals.startDate,vals.endDate,vals.name,vals.pageSize]);
}

// 续租前合同列表
export function getOldList(vals:any) {
    return getData(1495, [vals]);
}
export function getOldOne(uid:any) {
    return getData(1494, [uid]);
}

export function getdJContractList(vals:any) {
    return getData(1560, [vals.page,vals.contractStatus,vals.startDate,vals.endDate,vals.name,vals.pageSize]);
}
export function getdJContractListfy(vals:any) {
    return getData(1561, [vals.contractStatus,vals.startDate,vals.endDate,vals.name,vals.pageSize]);
}
export function removedj(vals:any) {
    return getData(1558, [vals]);
}
export function checkDjContract(uid:number,stutes:number) {
    return getData(1559, [uid,stutes]);
}