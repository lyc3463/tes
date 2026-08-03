import { getData, send7777 } from '@/network/http';

export function get1001() {
    return getData(1001, [])
}
export function get1166(page:number,name:string,phone:string,stutes:number) {
    return getData(1392, [page,name,phone,'2000-01-01','2099-01-01',stutes])
}
// 切换园区
export function swPark(e) {
    // return getData(1820, [e])
    return getData(1831, [e])
}