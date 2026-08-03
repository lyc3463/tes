import { getData,postData } from '@/network/http';

export function add(vals:any) {
    return postData(1636, [vals.startDate,vals.userID],vals.goosJosn);
}
export function edit(vals:any) {
    return postData(1637, [vals.uid,vals.startDate],vals.goosJosn);
}
export function remove(id:number) {
    return getData(1638, [id]);
}
export function one(id:string) {
    return getData(1640, [id]);
}
export function fetch(vals:any) {
    return getData(1641, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.status,vals.pageSize,vals.userID]);
}
export function reject(vals:any) {
    return postData(1642, [vals.uid,vals.rejectStatus,vals.remark],'');
}
export function check(vals:any) {
    return getData(1639, [vals,2]);
}
export function release(vals:any) {
    return getData(1643, [vals.uid,3,vals.imgs]);
}