import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1318, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate]);
}

export function fenye(vals:any) {
    return getData(1319, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate]);
}



