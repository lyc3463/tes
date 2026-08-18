import {getData, postData} from '@/network/http';

// 园区列表
export function fetch() {
    return getData(1010, ['','','',0]);
}
// 园区所属的仓库列表
export function warehouseList(parkId:number,isXs:number) {
    return getData(1793, ['',isXs,parkId]);
}
