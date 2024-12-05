import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1297, [vals.page,vals.name,vals.phone]);
}
export function add(vals:any) {
    return getData(1293, [vals.accountName,vals.cardNum,vals.bankPhone,vals.bankName]);
}


export function edit(vals:any) {
    return getData(1294, [vals.uid,vals.accountName,vals.cardNum,vals.bankPhone,vals.bankName]);
}

export function remove(vals:any) {
    return getData(1295, [vals]);
}
export function one(vals:any) {
    return getData(1296, [vals]);
}
export function onisoff(vals:any) {
    return getData(1412, [vals.did,vals.stutes]);
}
