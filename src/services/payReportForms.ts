import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1562, [vals.name,vals.phone,vals.startDate,vals.endDate]);
}

export function fenye(vals:any) {
    return getData(1562, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}



