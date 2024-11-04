import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1366, [vals.page,vals.startDate,vals.endDate,vals.stutes]);
}
export function fenye(vals:any) {
    return getData(1367, [vals.startDate,vals.endDate,vals.stutes]);
}
export function add(vals:any) {
    return getData(1364, [vals.handAmount,vals.handType,vals.openId]);
}
export function check(vals:any) {
    return getData(1365, [vals.uid,vals.stutes=2]);
}
export function remove(vals:any) {
    return getData(1368, [vals.uid]);
}
export function one(vals:any) {
    return getData(1370, [vals.uid]);
}
export function edit(vals:any) {
    return getData(1368, [vals.uid,vals.handAmount,vals.handType,vals.openId]);
}
