import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1226, [vals.page,vals.name,vals.startDate,vals.endDate,vals.stutes=1]);
}
export function fenye(vals:any) {
    return getData(1227, [vals.name,vals.startDate,vals.endDate,vals.stutes=1]);
}
export function companyList(vals:any) {
    return getData(1447, [vals.name]);
}
