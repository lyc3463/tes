import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1634, [vals.page,vals.startDate,vals.endDate,vals.pageSize]);
}

export function add(vals:any) {
    return postData(1631, [vals.imgs,vals.title],vals.content);
}

export function remove(vals:any) {
    return getData(1632, [vals]);
}

export function one(vals:any) {
    return getData(1633, [vals]);
}
export function fenye(vals:any) {
    return getData(1635, [vals.startDate,vals.endDate,vals.pageSize]);
}

