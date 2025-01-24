import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1355, [vals.page,vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.recordStatus,vals.remark]);
}
export function fenye(vals:any) {
    return getData(1356, [vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.recordStatus,vals.remark]);
}