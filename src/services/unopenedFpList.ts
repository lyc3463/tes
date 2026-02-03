import { getData } from '@/network/http';

export function shuidianfetch(vals:any) {
    return getData(1807, [vals.tenantr,vals.stutes,vals.type,vals.startDate,vals.endDate]);
}
export function allfetch(vals:any) {
    return getData(1469, [vals.page,vals.type,vals.tenantr,vals.stutes,vals.pageSize,vals.name]);
}
export function allfenye(vals:any) {
    return getData(1470, [vals.type,vals.tenantr,vals.stutes,vals.pageSize,vals.name]);
}

// 发票记录
export function fetch(page:number,userName:string,phone:string,userId:number,type:number,stutes:number,pageSize:number,startDate:string,endDate:string) {
    return getData(1808, [page,userName,phone,userId,type,stutes,pageSize,startDate,endDate]);
}
// 发票记录分页
export function fenye(userName:string,phone:string,userId:number,type:number,stutes:number,pageSize:number,startDate:string,endDate:string) {
    return getData(1809, [userName,phone,userId,type,stutes,pageSize,startDate,endDate]);
}
// 其他发票
export function otherfetch(page:number,userName:string,phone:string,userId:number,type:number,stutes:number,pageSize:number,startDate:string,endDate:string) {
    return getData(1810, [page,userName,phone,userId,type,stutes,pageSize,startDate,endDate]);
}
// 其他记录分页
export function otherfenye(userName:string,phone:string,userId:number,type:number,stutes:number,pageSize:number,startDate:string,endDate:string) {
    return getData(1811, [userName,phone,userId,type,stutes,pageSize,startDate,endDate]);
}