import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1305, [vals.page,vals.collector_id,vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1306, [vals.collector_id,vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}
// 手动抄电表
export function shoudongdian() {
    return getData(1303, []);
}
