import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1577, [vals.page,vals.tenantName,vals.goodsName,vals.userId,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1573, [vals.userId,vals.goodsName,vals.goodsMoney,vals.goodsType]);
}

export function edit(vals:any) {
    return getData(1574, [vals.uid,vals.goodName,vals.goodsMoney]);
}

export function remove(vals:any) {
    return getData(1575, [vals]);
}

export function one(vals:any) {
    return getData(1576, [vals]);
}
export function fenye(vals:any) {
    return getData(1578, [vals.tenantName,vals.goodsName,vals.userId,vals.pageSize]);
}

