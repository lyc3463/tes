import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1829, [vals.page,vals.address,vals.tenantName,vals.remark,vals.pageSize,vals.tenantId]);
}
export function fenye(vals:any) {
    return getData(1830, [vals.address,vals.tenantName,vals.remark,vals.pageSize,vals.tenantId]);
}