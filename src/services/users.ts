import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1245, [vals.phone]);
}

export function add(vals:any) {
    return getData(1242, [vals.name,vals.phone,vals.passWord,vals.joinqx,vals.is_zb=1,vals.role_id,vals.deviceId='1']);
}

export function edit(vals:any) {
    return getData(1243, [vals.uid,vals.user_name,vals.joinqx,vals.role_id]);
}

export function remove(vals:any) {
    return getData(1244, [vals]);
}
export function one(vals:any) {
    return getData(1246, [vals]);
}
