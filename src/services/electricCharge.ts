import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1314, [vals.address,vals.remark,vals.name,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1315, [vals.address,vals.remark,vals.name,vals.startDate,vals.endDate]);
}