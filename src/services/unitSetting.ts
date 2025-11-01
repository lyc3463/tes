import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1703, [vals.page,vals.name,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1704, [vals.name,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1698, [vals.unitsName,vals.unitsCode]);
}

export function edit(vals:any) {
    return getData(1699, [vals.uid,vals.unitsName,vals.unitsCode]);
}

export function remove(vals:any) {
    return getData(1701, [vals]);
}
export function one(vals:any) {
    return getData(1702, [vals]);
}


