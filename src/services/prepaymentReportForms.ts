import { getData } from '@/network/http';

export function fetch(vals: any) {
    return getData(1883, [vals.page, vals.name, vals.phone, vals.startDate, vals.endDate, vals.pageSize]);
}