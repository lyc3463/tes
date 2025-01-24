import { postData,getData } from '@/network/http';
export function fetch(vals:any) {
    return getData(1162, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID]);
}
// export function fetch(vals:any) {
//     return getData(1250, [vals.page,vals.name,vals.type,vals.startDate,vals.endDate,vals.tenant]);
// }
export function fenye(vals:any) {
    return getData(1163, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID]);
}
// export function fenye(vals:any) {
//     return getData(1250, [vals.name,vals.type,vals.startDate,vals.endDate,vals.tenant]);
// }

//公共缴费列表
export function alljiaofei(vals:any) {
    return getData(1439, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=2,vals.tenandId]);
}
//公共缴费列表分页
export function alljiaofeifenye(vals:any) {
    return getData(1440, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=2,vals.tenandId]);
}

//租金缴费列表
export function zujinList(vals:any) {
    return getData(1433, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=2,vals.tenandId]);
}
//租金缴费列表分页
export function zujinListFenye(vals:any) {
    return getData(1434, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=2,vals.tenandId]);
}
//损耗缴费记录
export function sunhaoList(vals:any) {
    return getData(1441, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=2,vals.tenandId]);
}
//损耗缴费记录分页
export function sunhaoListFenye(vals:any) {
    return getData(1442, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=2,vals.tenandId]);
}