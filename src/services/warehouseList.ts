import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1714, [vals.page,vals.warehouseName,vals.personName,vals.personPhone,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1715, [vals.warehouseName,vals.personName,vals.personPhone,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1711, [vals.warehouseName,vals.typeId,vals.warehouseAddress,vals.personName,vals.personPhone]);
}

export function edit(vals:any) {
    return getData(1712, [vals.uid,vals.warehouseName,vals.typeId,vals.warehouseAddress,vals.personName,vals.personPhone]);
}

export function remove(vals:any) {
    return getData(1716, [vals]);
}
export function one(vals:any) {
    return getData(1713, [vals]);
}


