import { getData } from '@/network/http';

export function login(yhm: string, mm: string,device:string,biaoshi:number,yzm:string,checkSms:number) {
    return getData(1002, [yhm, mm,device,biaoshi,yzm,checkSms]);
}

export function get1037(sjh: string, yzm: string) {
    return getData(1037, [sjh, yzm])
}

export function get1038(token: string) {
    return getData(1038, [token])
}

export function loginYzm(phone:string,type:number,shebei:string,is_zb:number) {
    return getData(1059, [phone,type,shebei,is_zb])
}
export function outLogin() {
    return getData(1005, [])
}
export function editPwd(editpwdPhone,md5Pwd,iszb=1) {
    return getData(1249, [editpwdPhone,md5Pwd,iszb])
}
export function duanxinyanzhen(phone,yzm) {
    return getData(1256, [phone,yzm])
}
export function test1870() {
    return getData(1870, [])
}