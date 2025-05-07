import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1121, [vals.page,vals.waterAddress,vals.name,vals.remark,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1122, [vals.waterAddress,vals.name,vals.remark,vals.pageSize]);
}
export function add(vals:any) {
    return getData(1117, [vals.cid,vals.collectorid,vals.water_type,vals.address,vals.priceid,vals.remark]);
}


export function edit(vals:any) {
    return getData(1118, [vals.uid,vals.water_type,vals.priceid,vals.remark]);
}

export function remove(vals:any) {
    return getData(1119, [vals]);
}
export function one(vals:any) {
    return getData(1120, [vals]);
}

export function off(vals:any) {
    return getData(1363, [vals.uid,vals.stutes]);
}
export function addcz(vals:any) {
    return getData(1394, [vals.uid,vals.q]);
}
export function addkh(vals:any) {
    return getData(1395, [vals.uid]);
}
export function ql(vals:any) {
    return getData(1401, [vals]);
}


