import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1822, [vals.page,vals.address,vals.tenantName,vals.remark,vals.pageSize,vals.tenantId]);
}
export function fenye(vals:any) {
    return getData(1823, [vals.address,vals.tenantName,vals.remark,vals.pageSize,vals.tenantId]);
}