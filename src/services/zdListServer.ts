import { postData,getData } from '@/network/http';
export function fetch(vals:any) {
    return getData(1162, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID]);
}