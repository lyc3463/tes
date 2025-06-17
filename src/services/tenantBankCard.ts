import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1584, [vals.page,vals.cardNum,vals.phone,vals.name,vals.userId,vals.status,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1585, [vals.cardNum,vals.phone,vals.name,vals.userId,vals.status,vals.pageSize]);
}

export function one() {
    return getData(1429, []);
}
export function check(uid:number,status:number) {
    return getData(1588, [uid,status]);
}
export function test(vals:any) {
    return getData(1497, [vals.amount,vals.reamak]);
}