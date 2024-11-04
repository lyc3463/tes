import { postData,getData } from '@/network/http';

export function add(vals:any) {
    return getData(1340, [vals.money,vals.numberItems]);
}
export function fetch(vals:any) {
    return getData(1342, [vals.page,vals.startDate,vals.endDate,vals.stutes]);
}
export function fenye(vals:any) {
    return getData(1343, [vals.startDate,vals.endDate,vals.stutes]);
}
export function one() {
    return getData(1286, []);
}