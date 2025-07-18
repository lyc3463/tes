import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1562, [vals.name,vals.phone,vals.startDate,vals.endDate]);
}

export function fenye(vals:any) {
    return getData(1579, [vals.name,vals.phone,vals.startDate,vals.endDate,vals.pageSize]);
}


export function fetch1598(vals:any) {
    return getData(1598, [vals.name,vals.phone,vals.startDate,vals.endDate]);
}



