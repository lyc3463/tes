import { getData, send7777 } from '@/network/http';

export function get1001() {
    return getData(1001, [])
}
export function get1166(page:number,name:string,phone:string,stutes:number,openid:string) {
    return getData(1166, [page,name,phone,'2000-01-01','2099-01-01',stutes,openid])
}