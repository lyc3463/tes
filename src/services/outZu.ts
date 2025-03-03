import {getData} from "@/network/http";

export function fetch(vals:any) {
    return getData(1483, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1484, [vals.name,vals.phone,vals.startDate,vals.endDate]);
}
export function add(vals:any) {
    return getData(1487, [vals.uid,vals.payAmount]);
}
export function addremark(vals:any) {
    return getData(1488, [vals.uid,vals.addremark]);
}