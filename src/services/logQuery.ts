import {getData} from "@/network/http";

export function fetch(vals:any) {
    return getData(1320, [vals.page,vals.name,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1321, [vals.name,vals.startDate,vals.endDate]);
}
