import {getData, postData} from '@/network/http';
// 查看特色列表
export function fetch(vals:any) {
    return getData(1104, [vals.page,vals.collector_number,vals.stutes]);
}
// 添加特色
export function add(vals:any) {
    return getData(1100, [vals.collector_number,vals.remark]);
}
export function edit(vals:any) {
    return getData(1101, [vals.uid,vals.collectorid,vals.remark]);
}

export function remove(vals:any) {
    return getData(1102, [vals]);
}
export function one(vals:any) {
    return getData(1103, [vals]);
}
export function fenye(vals:any) {
    return getData(1105, [vals.collector_number,vals.stutes]);
}

// 无分页下拉
export function fetchCtr() {
    return getData(1505, []);
}