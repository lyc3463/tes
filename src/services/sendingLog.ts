import {getData, postData} from '@/network/http';
// 查看装修列表
export function fetch(vals:any) {
    return getData(1060, [vals.current,vals.phone,vals.starTime,vals.endTime,vals.pageSize]);
}
// 添加装修
export function fenye(vals:any) {
    return getData(1061, [vals.phone,vals.starTime,vals.endTime,vals.pageSize]);
}



