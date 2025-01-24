import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1272, [vals.page,vals.identifier,vals.contractType,vals.stutes=2,vals.startDate,vals.endDate,vals.name]);
}
export function fenye(vals:any) {
    return getData(1450, [vals.identifier,vals.contractType,vals.stutes=2,vals.startDate,vals.endDate,vals.name]);
}
