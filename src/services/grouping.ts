import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1183, [vals.name,vals.pageSize]);
}

export function add(vals:any) {
    return postData(1181, [vals.name],vals.joinGateList);
}

export function edit(vals:any) {
    return postData(1184, [vals.uid,vals.defaultName],vals.joinGateList);
}

export function remove(vals:any) {
    return getData(1182, [vals]);
}

export function one(vals:any) {
    return getData(1300, [vals]);
}

