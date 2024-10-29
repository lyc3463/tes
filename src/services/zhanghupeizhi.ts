import {getData, postData} from '@/network/http';
export function edit(vals:any) {
    return getData(1324, [vals.settlement,vals.settlementTime,vals.maxAmount,vals.reserveAmount,vals.commission]);
}

export function one() {
    return getData(1325, []);
}
export function add(vals:any) {
    return getData(1328, [vals.withdAmount,vals.remark,vals.commissionz]);
}
