import {getData, postData} from '@/network/http';
// 查看特色列表
export function fetch(vals:any) {
    return getData(1567, [vals.page,vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.remark,vals.pageSize]);
}

export function fenye(vals:any) {
    return getData(1568, [vals.cid,vals.name,vals.startDate,vals.endDate,vals.tenantId,vals.remark,vals.pageSize]);
}
