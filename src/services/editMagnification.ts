import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1565, [vals.page,vals.address,vals.remark,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1566, [vals.address,vals.remark,vals.pageSize]);
}