import { postData,getData } from '@/network/http';

export function add(vals:any) {
    return getData(1340, [vals.money,vals.numberItems]);
}
export function fetch(vals:any) {
    return getData(1342, [vals.page,vals.startDate,vals.endDate,vals.stutes,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1343, [vals.startDate,vals.endDate,vals.stutes,vals.pageSize]);
}
export function one() {
    return getData(1286, []);
}
// 微信二维码
export function addchongzhi(vals:any) {
    return getData(8001, [vals.newMoney,vals.remarks,vals.numberItems,vals.rechargetype,vals.startDate]);
}
// 支付宝二维码
export function addaliPayQr(vals:any) {
    return getData(1499, [vals.newMoney,vals.payType,vals.numberItems,vals.remarks,vals.startDate,vals.rechargetype]);
}
//充值的时候调用一下轮询查看订单号是否支付成功
export function lunxun(dingdan:string) {
    return getData(8003, [dingdan]);
}

export function infoMealId(vals:any) {
    return getData(1569, [vals]);
}
// 斗拱微信二维码
export function adddgchongzhi(vals:any) {
    return getData(1871, [vals.newMoney,vals.remarks,vals.rechargetype,vals.startDate,vals.numberItems,vals.payType]);
}