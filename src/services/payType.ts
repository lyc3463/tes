import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1769, [vals.page,vals.name,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1766, [vals.pmName]);
}

export function edit(vals:any) {
    return getData(1767, [vals.uid,vals.pmName]);
}

export function remove(vals:any) {
    return getData(1770, [vals]);
}
export function one(vals:any) {
    return getData(1768, [vals]);
}


