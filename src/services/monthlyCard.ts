import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1535, [vals.page,vals.appId]);
}
export function fenye(vals:any) {
    return getData(1536, [vals.carNo,vals.appId]);
}
export function loogoo(vals:any) {
    return getData(1533, [vals.looffCarNo,vals.looffCarColor,vals.parkServiceId]);
}