import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1115, [vals.page,vals.collectorId,vals.name,vals.remark]);
}

export function add(vals:any) {
    return getData(1111, [vals.cid, vals.collectorid, vals.electricity_type, vals.address, vals.priceid, vals.rate, vals.remark]);
}


export function edit(vals:any) {
    return getData(1112, [vals.uid,vals.electricity_type,vals.priceid, vals.rate, vals.remark]);
}

export function remove(vals:any) {
    return getData(1113, [vals]);
}
export function fenye(vals:any) {
    return getData(1116, [vals.collectorId,vals.name,vals.remark]);
}

export function one(vals:string) {
    return getData(1114, [vals]);
}
export function off(vals:any){
    return getData(1168,[vals.uid,vals.stutes])
}

export function addcz(vals:any){
    return getData(1396,[vals.uid,vals.money])
}
export function ql(vals:any){
    return getData(1400,[vals])
}
export function cableList(vals:any) {
    return getData(1448, [vals.remark]);
}
