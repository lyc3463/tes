import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1160, [vals.page,vals.name,vals.phone]);
}
export function fenye(vals:any) {
    return getData(1161, [vals.name,vals.phone]);
}

