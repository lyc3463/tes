import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1727, [vals.name]);
}
export function add(vals:any) {
    return getData(1723, [vals.brandName]);
}

export function edit(vals:any) {
    return getData(1724, [vals.uid,vals.brandName]);
}

export function remove(vals:any) {
    return getData(1725, [vals]);
}
export function one(vals:any) {
    return getData(1726, [vals]);
}


