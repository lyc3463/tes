import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1115, [vals.page,vals.collectorId]);
}

export function add(vals:any) {
    return getData(1111, [vals.label_id=0, vals.cid, vals.collectorid, vals.electricity_type, vals.address, vals.priceid, vals.rate, vals.remark]);
}


export function edit(vals:any) {
    return getData(1112, [vals.uid,vals.cid,vals.electricity_type,vals.address,vals.label_id=0, vals.priceid, vals.rate, vals.remark]);
}

export function remove(vals:any) {
    // return getData(1032, [vals]);
}
export function fenye(vals:any) {
    return getData(1116, [vals.collectorId]);
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

