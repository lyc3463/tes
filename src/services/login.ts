import { getData } from '@/network/http';

export function login(yhm: string, mm: string,yzm:string,biaoshi:number,device:string) {
    return getData(1002, [yhm, mm,yzm,biaoshi,device]);
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
export function outLogin(id) {
    return getData(1005, [id])
}
export function editPwd(editpwdPhone,md5Pwd,iszb=1) {
    return getData(1249, [editpwdPhone,md5Pwd,iszb])
}
export function duanxinyanzhen(phone,yzm) {
    return getData(1256, [phone,yzm])
}