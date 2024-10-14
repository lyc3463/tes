import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1183, [vals.name]);
}

export function add(vals:any) {
    return getData(1181, [vals.parentId,vals.groupName,vals.level]);
}

export function edit(vals:any) {
    // return getData(1146, [vals.uid,vals.item_name,vals.itemType,vals.item_interval,vals.deduction_method,vals.monthly_amount,vals.count_method,vals.price,vals.remark,vals.prepaidAmount]);
}

export function remove(vals:any) {
    // return getData(1013, []);
}

export function one(vals:any) {
    // return getData(1148, [vals]);
}

