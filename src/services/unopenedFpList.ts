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