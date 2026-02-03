import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1781, [vals.warehouseName,vals.productsName,vals.startDate,vals.endDate]);
}