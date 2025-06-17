import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1316, [vals.address,vals.remark,vals.name,vals.startDate,vals.endDate,vals.tenantId]);
}
export function fenye(vals:any) {
    return getData(1317, [vals.collectorID,vals.name,vals.startDate,vals.endDate,vals.pageSize,vals.tenantId]);
}