import { getData,postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1443, [vals.page,vals.orderNum,vals.startDate,vals.endDate,vals.type,vals.stutes]);
}
export function fenye(vals:any) {
    return getData(1444, [vals.orderNum,vals.startDate,vals.endDate,vals.type,vals.stutes]);
}