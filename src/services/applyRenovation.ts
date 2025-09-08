import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1649, [vals.page,vals.name,vals.phone,vals.stutes,vals.pageSize,vals.userID]);
}
// 添加特色
export function add(vals:any) {
    return getData(1644, [vals.startDate,vals.endDate,vals.userID,vals.newBase64,vals.newBase642,vals.newBase643,vals.newBase644,vals.newBase645,vals.newBase646,vals.newBase647,vals.newBase648,vals.type]);
}
export function edit(vals:any) {
    return getData(1645, [vals.uid,vals.startDate,vals.imgName,vals.type]);
}
export function editDeposit(vals:any) {
    return getData(1655, [vals.uid,vals.applyMoney]);
}
export function check(vals:any) {
    return getData(1647, [vals]);
}
export function remove(vals:any) {
    return getData(1646, [vals]);
}
export function one(vals:any) {
    return getData(1648, [vals]);
}
export function getPDFBase64(vals:any) {
    return getData(1656, [vals]);
}
export function fenye(vals:any) {
    return getData(1650, [vals.name,vals.phone,vals.stutes,vals.pageSize,vals.userID]);
}
