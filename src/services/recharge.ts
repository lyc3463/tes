import { postData,getData } from '@/network/http';

export function add(vals:any) {
    return getData(1340, [vals.money,vals.numberItems]);
}
export function fetch(vals:any) {
    return getData(1342, [vals.page,vals.startDate,vals.endDate,vals.stutes]);
}
export function fenye(vals:any) {
    return getData(1343, [vals.startDate,vals.endDate,vals.stutes]);
}
export function one() {
    return getData(1286, []);
}
export function addchongzhi(vals:any) {
    return getData(8001, [vals.money,vals.remarks]);
}
//充值的时候调用一下轮询查看订单号是否支付成功
export function lunxun() {
    return getData(8003, []);
}