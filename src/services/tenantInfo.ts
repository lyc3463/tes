import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1166, [vals.page,vals.content,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.openid,vals.pageSize]);
}

export function add(vals:any) {
    return postData(1164, [vals.tenantId,vals.upimg,vals.mouny=0,vals.title],vals.conten);
}

export function edit(vals:any) {
    // return getData(1087, [vals.uid,vals.conten,vals.openID,vals.upimg,vals.mouny]);
}

export function remove(vals:any) {
    return getData(1165, [vals]);
}
export function one(vals:any) {
    return getData(1090, [vals]);
}

export function fenye(vals:any) {
    return getData(1167, [vals.content,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.openid,vals.pageSize]);
}
export function userList() {
    return getData(1489, []);
}
export function addFp(vals:any) {
    return getData(1387, [vals.appId,vals.upimg,vals.conten]);
}


