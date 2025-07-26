import {getData, postData} from '@/network/http';
export function fetchpz() {
    return getData(1493, []);
}
export function addpz(vals:any) {
    return getData(1492, [vals]);
}
export function enidWxID(authCorpId:string) {
    return getData(1603, [authCorpId]);
}
export function wxInfo() {
    return getData(1604, []);
}
