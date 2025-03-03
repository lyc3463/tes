import { postData } from '@/network/http';

export function fetch(vals:string,isYs:number) {
    return postData(1042, [isYs],vals);
}