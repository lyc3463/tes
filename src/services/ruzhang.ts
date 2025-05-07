import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1541, [vals.page,vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1542, [vals.stutes,vals.startDate,vals.endDate,vals.pageSize]);
}