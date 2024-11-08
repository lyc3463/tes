import {getData, postData} from '@/network/http';

// 天用水统计
export function dayfetch(vals:any) {
    return getData(1388, [vals.startDate,vals.endDate]);
}
// 月用水统计
export function moonfetch(vals:any) {
    return getData(1389, [vals.startDate,vals.endDate]);
}
// 年用水统计
export function yearfetch(vals:any) {
    return getData(1390, [vals.startDate,vals.endDate]);
}
// // 用水详情列表
// export function fetch(page:number,cid:string,name:string,startDate:string,endDate:string) {
//     return getData(1391, [page,cid,name,startDate,endDate]);
// }
// // 用水详情分页
// export function fenye(cid:string,name:string,startDate:string,endDate:string) {
//     return getData(1356, [cid,name,startDate,endDate]);
// }

