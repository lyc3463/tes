import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1475, [vals.page,vals.startDate,vals.endDate,vals.stutes,vals.openId,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1476, [vals.startDate,vals.endDate,vals.stutes,vals.openId,vals.pageSize]);
}
export function check(vals:any) {
    return getData(1477, [vals.uid,vals.stutes=2]);
}
export function one(vals:any) {
    return getData(1474, [vals]);
}
