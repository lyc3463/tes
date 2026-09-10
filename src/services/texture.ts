import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1804, [vals.name]);
}
export function add(vals:any) {
    return getData(1800, [vals]);
}

export function edit(vals:any) {
    return getData(1801, [vals.uid,vals.editTypeName]);
}

export function remove(vals:any) {
    return getData(1802, [vals]);
}
export function one(vals:any) {
    return getData(1803, [vals]);
}