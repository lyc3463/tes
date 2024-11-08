import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1316, [vals.page,vals.collectorID,vals.name,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1317, [vals.collectorID,vals.name,vals.startDate,vals.endDate]);
}