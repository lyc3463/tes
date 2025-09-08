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
export function addWxInfo(vals:any) {
    return getData(1608, [vals.qyName,vals.authCorpId]);
}
export function editWxInfo(vals:any) {
    return getData(1609, [vals.uid,vals.qyName,vals.authCorpId]);
}
export function deleteWxInfo(vals:any) {
    return getData(1610, [vals]);
}
export function getWxInfo(vals:any) {
    return getData(1611, [vals]);
}
export function getWxInfoList(vals) {
    return getData(1612, [vals]);
}