import {getData, postData} from '@/network/http';
export function fetch() {
    return getData(1837, []);
}
