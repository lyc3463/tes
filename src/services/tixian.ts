import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1331, [vals.page,vals.stutes,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1332, [vals.stutes,vals.startDate,vals.endDate]);
}


