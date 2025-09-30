import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1672, [vals.page,vals.type,vals.name,vals.pageSize]);
}
export function edit(vals:any) {
    return getData(1674, [vals.uid,vals.renewalRemark]);
}
export function fenye(vals:any) {
    return getData(1673, [vals.type,vals.name,vals.pageSize]);
}



