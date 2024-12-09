import {getData, postData} from '@/network/http';
export function contractTypeList() {
    return getData(1410, []);
}