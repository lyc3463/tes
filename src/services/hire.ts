import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1504, [vals.name,vals.beginRents,vals.endRents]);
}
// export function fenye(vals:any) {
//     return getData(1313, [vals.name,vals.beginRents,vals.endRents,vals.stutes,vals.house_id]);
// }