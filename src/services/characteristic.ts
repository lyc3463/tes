import {getData, postData} from '@/network/http';
// 查看特色列表
export function fetch(vals:any) {
    return getData(1051, [vals.name]);
}
// 添加特色
export function add(vals:any) {
    return getData(1048, [vals.name,vals.stutes=1]);
}


export function edit(vals:any) {
    return getData(1049, [vals.id,vals.feature_name,vals.TSStatus=1]);
}

export function remove(vals:any) {
    return getData(1050, [vals]);
}
export function one(vals:any) {
    return getData(1052, [vals]);
}
