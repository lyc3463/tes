import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1160, [vals.page,vals.name,vals.phone]);
}
export function fenye(vals:any) {
    return getData(1161, [vals.name,vals.phone]);
}

export function edit(vals:any) {
    return getData(1292, [vals.openID,vals.joinqx]);
}
export function one(vals:any) {
    return getData(1159, [vals]);
}
