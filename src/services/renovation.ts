import {getData, postData} from '@/network/http';
// 查看装修列表
export function fetch(vals:any) {
    return getData(1046, [vals.name]);
}
// 添加装修
export function add(vals:any) {
    return getData(1043, [vals.name,vals.stutes=0]);
}


export function edit(vals:any) {
    return getData(1044, [vals.id,vals.renovation_name,vals.ZXStatus=0]);
}

export function remove(vals:number) {
    return getData(1045, [vals]);
}
export function one(vals:number) {
    return getData(1047, [vals]);
}

