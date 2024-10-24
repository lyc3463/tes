import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1225, [vals.name]);
}
export function add(vals:any) {
    return getData(1221, [vals.name,vals.is_enable]);
}

export function edit(vals:any) {
    return getData(1222, [vals.uid,vals.name,vals.is_enable]);
}

export function remove(vals:any) {
    return getData(1223, [vals]);
}
export function one(vals:any) {
    return getData(1224, [vals]);
}

