import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1127, [vals.page,vals.customName,vals.customBeginTime,vals.customEndTime,vals.customStatus]);
}
export function add(vals:any) {
    return getData(1123, [
        vals.custom_name,
        vals.custom_date,
        vals.visitor_type,
        vals.visitor_position,
        vals.company_name,
        vals.industry,
        vals.phone,
        vals.visitor_channels,
        vals.intermediary_name,
        vals.office_area,
        vals.reason_lease,
        vals.demands,
        vals.required_area,
        vals.remark
    ]);
}
export function edit(vals:any) {
    return getData(1124, [
        vals.uid,
        vals.custom_name,
        vals.custom_date,
        vals.visitor_type,
        vals.visitor_position,
        vals.company_name,
        vals.industry,
        vals.phone,
        vals.visitor_channels,
        vals.intermediary_name,
        vals.office_area,
        vals.reason_lease,
        vals.demands,
        vals.required_area,
        vals.remark
    ]);
}

export function remove(vals:any) {
    // return getData(1050, [vals]);
}
export function one(vals:any) {
    return getData(1126, [vals]);
}
export function check(vals:any) {
    return getData(1234, [vals]);
}
export function fenye(vals:any) {
    return getData(1128, [vals.customName,vals.customBeginTime,vals.customEndTime,vals.customStatus]);
}
export function editNum(vals:any) {
    return getData(1397, [vals.aid,vals.remark]);
}