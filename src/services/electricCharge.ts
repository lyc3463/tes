import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1314, [vals.page,vals.collectorID,vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1315, [vals.collectorID,vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}