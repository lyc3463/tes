import { postData } from '@/network/http';


// 单图上传
export function fetch(vals:string,isYs:number) {
    return postData(1042, [isYs],vals);
}
//多图上传
export function addList(vals:string) {
    return postData(1651, [],vals);
}