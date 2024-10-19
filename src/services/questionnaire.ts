import {getData, postData} from '@/network/http';
// 查看问题列表
export function fetch(vals:any) {
    return getData(1028, [vals.name]);
}
// 添加问题
export function add(vals:any) {
    return postData(1215, [vals.problem_name,vals.problem_type],vals.str);
}
export function edit(vals:any) {
    // return getData(1026, [vals.id,vals.area_name,vals.areaStatus]);
}

export function remove(vals:number) {
    // return getData(1027, [vals]);
}
export function one(vals:number) {
    // return getData(1029, [vals]);}
}
