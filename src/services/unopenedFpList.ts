import { getData } from '@/network/http';

export function shuidianfetch(vals:any) {
    return getData(1468, [vals.tenantr,vals.stutes,vals.type]);
}
export function allfetch(vals:any) {
    return getData(1469, [vals.page,vals.type,vals.tenantr,vals.stutes,vals.pageSize,vals.name]);
}
export function allfenye(vals:any) {
    return getData(1470, [vals.type,vals.tenantr,vals.stutes,vals.pageSize,vals.name]);
}

// 发票记录
export function fetch(page:number,userName:string,phone:string,userId:number,type:number,stutes:number,pageSize:number) {
    return getData(1615, [page,userName,phone,userId,type,stutes,pageSize]);
}
// 发票记录分页
export function fenye(userName:string,phone:string,userId:number,type:number,stutes:number,pageSize:number) {
    return getData(1616, [userName,phone,userId,type,stutes,pageSize]);
}
// 其他发票
export function otherfetch(page:number,userName:string,phone:string,userId:number,type:number,stutes:number,pageSize:number) {
    return getData(1617, [page,userName,phone,userId,type,stutes,pageSize]);
}
// 其他记录分页
export function otherfenye(userName:string,phone:string,userId:number,type:number,stutes:number,pageSize:number) {
    return getData(1618, [userName,phone,userId,type,stutes,pageSize]);
}