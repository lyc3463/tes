import {getData} from "@/network/http";

//公共缴费列表
export function alljiaofei(vals:any) {
    return getData(1439, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=1,vals.tenandId]);
}
//公共缴费列表分页
export function alljiaofeifenye(vals:any) {
    return getData(1440, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=1,vals.tenandId]);
}

//租金缴费列表
export function zujinList(vals:any) {
    return getData(1433, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=1,vals.tenandId]);
}
//租金缴费列表分页
export function zujinListFenye(vals:any) {
    return getData(1434, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=1,vals.tenandId]);
}
//损耗列表
export function sunhaoList(vals:any) {
    return getData(1441, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=1,vals.tenandId]);
}
//损耗列表分页
export function sunhaoListFenye(vals:any) {
    return getData(1442, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.stutes=1,vals.tenandId]);
}
//电费账单
export function eleList(page:number,cid:string,name:string,startDate:string,endDate:string,tenantId:number,recordStatus:string) {
    return getData(1355, [page,cid,name,startDate,endDate,tenantId,recordStatus]);
}
//电费账单分页
export function eleListFenye(cid:string,name:string,startDate:string,endDate:string,tenantId:number,recordStatus:string) {
    return getData(1356, [cid,name,startDate,endDate,tenantId,recordStatus]);
}