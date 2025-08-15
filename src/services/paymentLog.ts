import { getData,postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1443, [vals.page,vals.orderNum,vals.startDate,vals.endDate,vals.type,vals.stutes,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1444, [vals.orderNum,vals.startDate,vals.endDate,vals.type,vals.stutes,vals.pageSize]);
}
export function backFetch(vals:any) {
    return getData(1586, [vals.page,vals.orderNum,vals.startDate,vals.endDate,vals.type,vals.stutes,vals.pageSize]);
}
export function backFenye(vals:any) {
    return getData(1587, [vals.orderNum,vals.startDate,vals.endDate,vals.type,vals.stutes,vals.pageSize]);
}