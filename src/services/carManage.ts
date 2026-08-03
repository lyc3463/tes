import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1521, [vals.page,vals.carNo,vals.userId,vals.stutes,vals.pageSize,vals.userType,vals.uName,vals.uPhone]);
}
export function fenye(vals:any) {
    return getData(1522, [vals.carNo,vals.appId,vals.stutes,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1517, [vals.appId, vals.carNo, vals.carNoColor, vals.carType]);
}
export function edit(vals:any) {
    return getData(1518, [vals.uid,vals.appId, vals.carNo, vals.carNoColor, vals.carType]);
}
export function remove(vals:any) {
    return getData(1519, [vals]);
}
export function one(vals:any) {
    return getData(1520, [vals]);
}
export function check(vals:any) {
    return getData(1532, [vals.uid,vals.status]);
}
export function reactCarNo(vals:any) {
    return getData(1537, [vals]);
}