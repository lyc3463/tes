import {getData} from "@/network/http";

export function fetch(vals:any) {
    return getData(1485, [vals.page,vals.name,vals.phone,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1486, [vals.name,vals.phone,vals.startDate,vals.endDate]);
}