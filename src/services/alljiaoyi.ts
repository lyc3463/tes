import { postData,getData } from '@/network/http';
export function fetch(vals:any) {
    return getData(1543, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1544, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}
export function oldFetch(vals:any) {
    return getData(1689, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}
export function oldFenye(vals:any) {
    return getData(1690, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}
export function upDload(vals:any) {
    return getData(1691, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}