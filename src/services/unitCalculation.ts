import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1732, [vals.page,vals.name,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1733, [vals.name,vals.pageSize]);
}

export function add(vals:any) {
    return postData(1728, [vals.groupName],vals.jsonGoods);
}

export function edit(vals:any) {
    return postData(1729, [vals.uid,vals.groupName],vals.jsonGoods);
}

export function remove(vals:any) {
    return getData(1730, [vals]);
}
export function one(vals:any) {
    return getData(1731, [vals]);
}
export function oneGoodsList(vals:any) {
    return getData(1734, [vals]);
}


