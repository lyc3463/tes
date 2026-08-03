import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1627, [vals.page,vals.name,vals.phone,vals.stutes,vals.userId,vals.startDate,vals.endDate,vals.pageSize]);
}
export function add(vals:any) {
    return postData(1624, [vals.workGood,vals.workMoney,vals.workType,vals.workContent],'');
}
export function editStutes(vals:any) {
    return postData(1625, [vals.OnId,vals.step,vals.amount],'');
}
export function edit(vals:any) {
    return postData(1846, [vals.workGood,vals.workContent,vals.uid],'');
}
export function fenpei(vals:any) {
    return getData(1629, [vals.OnId,vals.userID]);
}
export function remove(vals:any) {
    return getData(1626, [vals]);
}
export function one(vals:any) {
    return getData(1224, [vals]);
}
export function reject(vals:any) {
    return getData(1628, [vals.uid,vals.rejectStatus,vals.remark]);
}




