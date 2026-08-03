import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1206, [vals.page,vals.name,vals.phone,vals.state,vals.openID,vals.startDate,vals.endDate,vals.pageSize]);
}

export function add(vals:any) {
    // return getData(1086, [vals.name,vals.company_id,vals.project_id]);
}

export function edit(vals:any) {
    return getData(1203, [vals.OnId,vals.step,vals.amount]);
}

export function remove(vals:any) {
    return getData(1204, [vals]);
}
export function one(vals:any) {
    return getData(1205, [vals]);
}
export function reject(vals:any) {
    return getData(1207, [vals.uid,vals.rejectStatus,vals.remark]);
}
export function fenpei(vals:any) {
    return getData(1288, [vals.OnId,vals.userID]);
}

