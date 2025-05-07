import { getData,postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1378, [vals.page,vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}
export function add(vals:any) {
    return postData(1374, [vals.identifier,vals.tenantName,vals.ownerName,vals.ownerCard,vals.zuMoney,vals.deposit,vals.startDate,vals.endDate],vals.jsonList);
}

export function edit(vals:any) {
    return postData(1375, [vals.uid,vals.identifier,vals.tenantName,vals.ownerName,vals.ownerCard,vals.zuMoney,vals.deposit,vals.startDate,vals.endDate],vals.jsonList);
}

export function remove(vals:any) {
    return getData(1376, [vals]);
}
export function fenye(vals:any) {
    return getData(1379, [vals.name,vals.startDate,vals.endDate,vals.pageSize]);
}
export function one(vals:any) {
    return getData(1377, [vals]);
}



