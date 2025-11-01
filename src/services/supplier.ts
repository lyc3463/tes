import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1720, [vals.page,vals.supplierName,vals.personName,vals.personPhone,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1721, [vals.supplierName,vals.personName,vals.personPhone,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1717, [vals.supplierName,vals.supplierAddress,vals.personName,vals.personPhone,vals.remark]);
}

export function edit(vals:any) {
    return getData(1718, [vals.uid,vals.supplierName,vals.supplierAddress,vals.personName,vals.personPhone,vals.remark]);
}

export function remove(vals:any) {
    return getData(1722, [vals]);
}
export function one(vals:any) {
    return getData(1719, [vals]);
}


