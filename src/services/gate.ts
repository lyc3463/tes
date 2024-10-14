import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1179, [vals.page,vals.deviceSn]);
}

export function add(vals:any) {
    return getData(1175, [vals.house_id,vals.deviceSn,vals.position]);
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

