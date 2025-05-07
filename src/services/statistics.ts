import {getData, postData} from '@/network/http';

// 小时用电统计
export function hourfetch(vals:any) {
    return getData(1359, [vals.startDate,vals.endDate]);
}
// 天用电统计
export function dayfetch(vals:any) {
    return getData(1360, [vals.startDate,vals.endDate]);
}
// 月用电统计
export function moonfetch(vals:any) {
    return getData(1361, [vals.startDate,vals.endDate]);
}
// 年用电统计
export function yearfetch(vals:any) {
    return getData(1362, [vals.startDate,vals.endDate]);
}
// 用电详情列表
export function fetch(page:number,cid:string,name:string,startDate:string,endDate:string,stutes:string,tenantId:number,remark:string,pageSize:number) {
    return getData(1355, [page,cid,name,startDate,endDate,tenantId,stutes,remark,pageSize]);
}
// 用电详情分页
export function fenye(cid:string,name:string,startDate:string,endDate:string,stutes:string,tenantId:number,remark:string,pageSize:number) {
    return getData(1356, [cid,name,startDate,endDate,tenantId,stutes,remark,pageSize]);
}
// 用电详情列表小时
export function fetchday(page:number,cid:string,name:string,startDate:string,endDate:string,stutes:string,tenantId:number,remark:string,pageSize:number) {
    return getData(1512, [page,cid,name,startDate,endDate,tenantId,stutes,remark,pageSize]);
}
// 用电详情分页小时
export function fenyeday(cid:string,name:string,startDate:string,endDate:string,stutes:string,tenantId:number,remark:string,pageSize:number) {
    return getData(1513, [cid,name,startDate,endDate,tenantId,stutes,remark,pageSize]);
}


