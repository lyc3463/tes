import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1301, [vals.page,vals.deviceSn,vals.startDate,vals.endDate]);
}
export function fenye(vals:any) {
    return getData(1302, [vals.deviceSn,vals.startDate,vals.endDate]);
}




