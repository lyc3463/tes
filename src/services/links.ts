import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1096, []);
}

export function add(vals:any) {
    return getData(1093, [vals.link_name,vals.link_address,vals.single]);
}

export function edit(vals:any) {
    return getData(1094, [vals.uid,vals.link_name,vals.link_address,vals.single]);
}

export function remove(vals:any) {
    return getData(1095, [vals]);
}
export function one(vals:any) {
    return getData(1097, [vals]);
}
