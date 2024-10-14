import {getData, postData} from '@/network/http';
// 查看特色列表
export function fetch(vals:any) {
    return getData(1076, [vals.name]);
}

export function add(vals:any) {
    return getData(1073, [vals.name]);
}


export function edit(vals:any) {
    return getData(1074, [vals.uid,vals.company_name]);
}

export function remove(vals:any) {
    return getData(1075, [vals]);
}
export function one(vals:any) {
    return getData(1077, [vals]);
}

// 查看公司底下包含的信息
export function getContainInfo(vals){
    return getData(1079,[vals])
}
