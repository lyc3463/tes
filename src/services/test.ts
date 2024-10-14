import { getData } from '@/network/http';

// 开门测试
export function test(deviceSn:string,house_id:number) {
    return getData(1191, [deviceSn,house_id]);
}
// 图片测试
export function testQrCode(vals:any) {
    return getData(1192, [vals.item,vals.id]);
}





