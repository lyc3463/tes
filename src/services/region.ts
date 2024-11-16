import {getData, postData} from '@/network/http';
// 查看区域列表
export function fetch(vals:any) {
    return getData(1028, [vals.name]);
}
// 添加区域
export function add(vals:any) {
    return getData(1025, [vals.name,vals.stutes=0]);
}


export function edit(vals:any) {
    return getData(1026, [vals.id,vals.area_name,vals.areaStatus=0]);
}

export function remove(vals:number) {
    return getData(1027, [vals]);
}
export function one(vals:number){
    return getData(1029, [vals]);}

