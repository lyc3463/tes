import {getData, postData} from '@/network/http';
export function add(vals:any) {
    return getData(1457, [vals.csName,vals.csLink,vals.csType]);
}
export function edit(vals:any) {
    return getData(1458, [vals.uid,vals.csName,vals.csLink,vals.csType]);
}
export function fetch() {
    return getData(1461, []);
}
export function one(uid:string) {
    return getData(1460, [uid]);
}
export function remove(uid:any) {
    return getData(1459, [uid]);
}