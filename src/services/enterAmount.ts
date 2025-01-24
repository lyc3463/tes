import { getData,postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1322, [vals.page,vals.name]);
}
export function edit(vals:any) {
    return getData(1327, [vals.tenantId,vals.tenantAmount]);
}
// export function one(vals:any) {
//     return getData(1153, [vals]);
// }
export function fenye(vals:any) {
    return getData(1323, [vals.name]);
}

