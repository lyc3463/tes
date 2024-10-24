import {getData, postData} from '@/network/http';
// 查看问题列表
export function fetch(vals:any) {
    return getData(1219, [vals.page,vals.name]);
}
// 添加问题
export function add(vals:any) {
    return postData(1215, [vals.problem_name,vals.problem_type],vals.str);
}
export function edit(vals:any) {
    return postData(1216, [vals.problem_name,vals.problem_type],vals.str);
}

export function remove(vals:number) {
    return getData(1217, [vals]);
}
export function one(vals:string) {
    return getData(1218, [vals]);
}
export function fenye(vals:any) {
    return getData(1220, [vals.name]);
}
