import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1708, [vals.name]);
}
export function fenye(vals:any) {
    return getData(1709, [vals.name,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1705, [vals.typeName]);
}

export function edit(vals:any) {
    return getData(1706, [vals.uid,vals.typeName]);
}

export function remove(vals:any) {
    return getData(1710, [vals]);
}
export function one(vals:any) {
    return getData(1707, [vals]);
}


