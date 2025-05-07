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
// 用水详情列表
export function fetch(page:number,cid:string,name:string,startDate:string,endDate:string,tenantId:number,recordStatus:string,remark:string,pageSize:number) {
    return getData(1357, [page,cid,name,startDate,endDate,tenantId,recordStatus,remark,pageSize]);
}
// 用水详情分页
export function fenye(cid:string,name:string,startDate:string,endDate:string,tenantId:number,recordStatus:string,remark:string,pageSize:number) {
    return getData(1358, [cid,name,startDate,endDate,tenantId,recordStatus,remark,pageSize]);
}

