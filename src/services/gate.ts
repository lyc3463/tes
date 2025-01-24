import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1179, [vals.page,vals.deviceSn]);
}

export function add(vals:any) {
    return getData(1175, [vals.house_id,vals.deviceSn,vals.position]);
}

export function edit(vals:any) {
    return getData(1176, [vals.uid,vals.house_id,vals.deviceSn,vals.position]);
}

export function remove(vals:any) {
    // return getData(1013, []);
}

export function one(vals:any) {
    return getData(1178, [vals]);
}
export function fenye(vals:any) {
    return getData(1180, [vals.deviceSn]);
}
export function synchronous() {
    return getData(1430, []);
}


