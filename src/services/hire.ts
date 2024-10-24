import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1312, [vals.page,vals.name,vals.phone]);
}
export function fenye(vals:any) {
    return getData(1313, [vals.name,vals.phone]);
}