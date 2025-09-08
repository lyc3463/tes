import {getData} from "@/network/http";

//公共缴费列表
export function alljiaofei(vals:any) {
    return getData(1439, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}
//公共缴费列表分页
export function alljiaofeifenye(vals:any) {
    return getData(1440, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}

//租金缴费列表
export function zujinList(vals:any) {
    return getData(1433, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}
//租金缴费列表分页
export function zujinListFenye(vals:any) {
    return getData(1434, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}
//损耗列表
export function sunhaoList(vals:any) {
    return getData(1441, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}
//损耗列表分页
export function sunhaoListFenye(vals:any) {
    return getData(1442, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}
//电费账单
export function eleList(page:number,cid:string,name:string,startDate:string,endDate:string,tenantId:number,recordStatus:string,remake:string,pageSize:number) {
    return getData(1355, [page,cid,name,startDate,endDate,tenantId,recordStatus,remake,pageSize]);
}
//电费账单分页
export function eleListFenye(cid:string,name:string,startDate:string,endDate:string,tenantId:number,recordStatus:string,remake:string,pageSize:number) {
    return getData(1356, [cid,name,startDate,endDate,tenantId,recordStatus,remake,pageSize]);
}
//违约金列表
export function weiyueList(vals:any) {
    return getData(1480, [vals.page,vals.name,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}
//违约金分页
export function weiyueListFenye(vals:any) {
    return getData(1481, [vals.name,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}
//违约金列表
export function weiyuejinInfoList(vals:number) {
    return getData(1554, [vals]);
}
// 报修账单列表
export function repairInvoiceList(vals:any) {
    return getData(1622, [vals.page,vals.name,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}
//报修账单分页
export function repairInvoiceFenye(vals:any) {
    return getData(1623, [vals.name,vals.startDate,vals.endDate,vals.stutes,vals.tenandId,vals.pageSize]);
}