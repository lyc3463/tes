import {getData, postData} from '@/network/http';
// 查看特色列表
export function fetch(vals:any) {
    return getData(1297, [vals.page,vals.cardNum,vals.phone]);
}
// 添加特色
export function add(vals:any) {
    return getData(1293, [vals.name,vals.cardNum,vals.phone,vals.bankName,vals.isDefault]);
}


export function edit(vals:any) {
    return getData(1294, [vals.uid,vals.name,vals.cardNum,vals.phone,vals.bankName,vals.isDefault]);
}

export function remove(vals:any) {
    return getData(1295, [vals]);
}
export function one(vals:any) {
    return getData(1296, [vals]);
}
export function fenye(vals:any) {
    return getData(1297, [vals.cardNum,vals.phone]);
}
