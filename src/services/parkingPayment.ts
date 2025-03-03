import {getData, postData} from '@/network/http';
export function add(vals:any) {
    return getData(1462, [vals.ppName,vals.ppLink]);
}
export function edit(vals:any) {
    return getData(1463, [vals.uid,vals.ppName,vals.ppLink]);
}
export function fetch() {
    return getData(1466, []);
}
export function one(uid:string) {
    return getData(1465, [uid]);
}
export function remove(uid:any) {
    return getData(1464, [uid]);
}