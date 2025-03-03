import {getData, postData} from '@/network/http';
// 查看特色列表
export function fetchpz() {
    return getData(1493, []);
}
// 添加特色
export function addpz(vals:any) {
    return getData(1492, [vals]);
}
