import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1777, [vals.warehouseName,vals.itemName,vals.startDate,vals.endDate]);
}
export function fetchOutbound(vals:any) {
    return getData(1778, [vals.warehouseName,vals.itemName,vals.startDate,vals.endDate]);
}