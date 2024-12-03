import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1225, [vals.name,vals.is_enable]);
}
export function add(vals:any) {
    return getData(1221, [vals.questName,vals.is_enable,vals.joinData]);
}
export function edit(vals:any) {
    return getData(1222, [vals.uid,vals.questName,vals.is_enable,vals.joinData]);
}

export function remove(vals:any) {
    return getData(1223, [vals]);
}
export function one(vals:any) {
    return getData(1224, [vals]);
}
export function offison(vals:any) {
    return getData(1411, [vals.uid,vals.is_enable]);
}
// export function fenye(vals:any) {
//     return getData(1121, [vals.page,vals.name]);
// }




