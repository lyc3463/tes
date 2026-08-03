import { getData } from '@/network/http';

export function fetch(vals:string) {
    return getData(1428, [vals]);
}
export function fenye(tenantName) {
    return getData(1427, [tenantName]);
}

export function one(startDate:string,tenantId:number,coutRactId:number) {
    return getData(1429, [startDate,tenantId,coutRactId]);
}
