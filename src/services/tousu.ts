import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1212, [vals.page,vals.name,vals.phone,vals.state,vals.startDate,vals.endDate,vals.openID,vals.pageSize]);
}
export function add(vals:any) {
    // return getData(1086, [vals.name,vals.company_id,vals.project_id]);
}
export function edit(vals:any) {
    return getData(1209, [vals.uid,vals.complaintContent,vals.complaintTitle,vals.type]);
}
export function check(vals:any) {
    return getData(1652, [vals,2]);
}
export function remove(vals:any) {
    // return getData(1013, []);
}
export function one(vals:any) {
    // return getData(1090, [vals]);
}
export function fenye(vals:any) {
    return getData(1213, [vals.name,vals.phone,vals.state,vals.startDate,vals.endDate,vals.openID,vals.pageSize]);
}


