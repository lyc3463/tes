import {getData, postData} from '@/network/http';

// 小时用电统计
export function fetch(vals:any) {
    return getData(1355, [vals.page,vals.cid,vals.name,vals.startDate,vals.endDate]);
}
// 天用电统计
export function fenye(vals:any) {
    return getData(1356, [vals.cid,vals.name,vals.startDate,vals.endDate]);
}


