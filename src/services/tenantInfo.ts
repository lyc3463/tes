import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1166, [vals.page,vals.content,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.openid]);
}

export function add(vals:any) {
    return getData(1164, [vals.conten,vals.openID,vals.upimg,vals.mouny=0]);
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
    return getData(1167, [vals.content,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.openid]);
}


