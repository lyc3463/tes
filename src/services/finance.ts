import { getData,postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1555, [vals.page,vals.pageSize,vals.startDate,vals.endDate]);
}

export function fenye(vals:any) {
    return getData(1556, [vals.pageSize,vals.startDate,vals.endDate]);
}