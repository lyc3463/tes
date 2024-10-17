import { getData } from '@/network/http';

// 开门测试
export function test(deviceSn:string,house_id:number) {
    return getData(1191, [deviceSn,house_id]);
}
// 图片测试
export function testQrCode(cishu:number,date:string,houn_id:number) {
    return getData(1192, [cishu,date,houn_id]);
}





