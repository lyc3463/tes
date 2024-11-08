import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1121, [vals.page,vals.name]);
}
export function add(vals:any) {
    return getData(1117, [vals.cid,vals.collectorid,vals.water_type,vals.address,vals.priceid,vals.rate,vals.remark]);
}


export function edit(vals:any) {
    // return getData(1118, [vals.uid,vals.account_name,vals.account_card,vals.balance,vals.account_type,vals.company_id,vals.project_id]);
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


