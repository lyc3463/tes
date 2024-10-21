import { getData } from '@/network/http';

// 开门测试
export function test(deviceSn:string) {
    return getData(1191, [deviceSn]);
}
// 图片测试
export function testQrCode(date:string,deviceSn:string) {
    return getData(1192, [date,deviceSn]);
}





