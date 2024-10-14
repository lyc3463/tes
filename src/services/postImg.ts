import { postData } from '@/network/http';

export function fetch(vals:string) {
    return postData(1042, [],vals);
}