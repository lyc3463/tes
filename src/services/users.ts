import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1245, [vals.phone,1]);
}

export function add(vals:any) {
    return postData(1242, [vals.name,vals.phone,vals.passWord,'',vals.is_zb=1,vals.role_id,vals.deviceId='1',vals.joinOsTask,vals.qyId,vals.joinPark],vals.joinqx);
}

export function edit(vals:any) {
    return postData(1243, [vals.uid,vals.user_name,'',vals.role_id,vals.phone,vals.joinOsTask,vals.qyId,vals.joinPark,vals.joinOldPark],vals.joinqx);
}

export function remove(vals:any) {
    return getData(1244, [vals]);
}
export function one(vals:any) {
    return getData(1246, [vals]);
}


export function permissionList() {
    return getData(1594, []);
}
export function addPermissionUser(vals:any) {
    return getData(1595, [vals]);
}
export function deactivate(vals:any) {
    return getData(1607, [vals.tid,vals.isEnable]);
}
