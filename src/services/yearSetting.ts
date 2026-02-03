import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1799, [vals.name]);
}
export function add(vals:any) {
    return getData(1795, [vals]);
}

export function edit(vals:any) {
    return getData(1796, [vals.uid,vals.editTypeName]);
}

export function remove(vals:any) {
    return getData(1797, [vals]);
}
export function one(vals:any) {
    return getData(1798, [vals]);
}


