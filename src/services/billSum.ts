import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1038, [vals.page,vals.billAbstract,vals.billBgeinTime,vals.billEndTime,vals.billStatus,vals.billMoneyType]);
}
export function one(vals:string) {
    return getData(1039, [vals]);
}