import { getData, postData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1282, [vals.name]);
}

export function add(vals:any) {
    return postData(1279, [vals.name],vals.authority);
}

export function edit(vals:any) {
    return postData(1280, [vals.uid,vals.role_name],vals.authority);
}

export function remove(vals:any) {
    return getData(1281, [vals]);
}
export function one(vals:any) {
    return getData(1283, [vals]);
}
// 查看所有使用该角色的用户
export function userList(vals:any) {
    return getData(1284, [vals]);
}
// 查看总不断角色
export function zbRole() {
    return getData(1875, ['']);
}
// 导入角色
export function zbFef(vals:any) {
    return postData(1876, [],vals);
}