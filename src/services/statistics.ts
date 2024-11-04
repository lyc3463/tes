import {getData, postData} from '@/network/http';

// 小时用电统计
export function hourfetch(vals:any) {
    return getData(1359, [vals.startDate,vals.endDate]);
}
// 天用电统计
export function dayfetch(vals:any) {
    return getData(1360, [vals.startDate,vals.endDate]);
}
// 月用电统计
export function moonfetch(vals:any) {
    return getData(1361, [vals.startDate,vals.endDate]);
}
// 年用电统计
export function yearfetch(vals:any) {
    return getData(1362, [vals.startDate,vals.endDate]);
}


