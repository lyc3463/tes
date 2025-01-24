import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1384, [vals.page,vals.startDate,vals.endDate,vals.stutes,vals.openId]);
}
export function fenye(vals:any) {
    return getData(1385, [vals.startDate,vals.endDate,vals.stutes,vals.openId]);
}
export function check(vals:any) {
    return getData(1386, [vals.uid,vals.stutes=2]);
}
export function one(vals:any) {
    return getData(1383, [vals]);
}