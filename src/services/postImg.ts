import { postData } from '@/network/http';


// 单图上传
export function fetch(vals:string,isYs:number) {
    return postData(1042, [isYs],vals);
}
//多图上传
export function addList(vals:string) {
    return postData(1651, [],vals);
}
// png 图片上传
export function fetch1078(vals:string,isYs:number) {
    return postData(1805, [isYs],vals);
}
// pdf 上传
export function pdfPost(vals:string) {
    return postData(1870, [],vals);
}