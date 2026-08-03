import {getData, postData} from '@/network/http';
export function fetchpz(type) {
    return getData(1493, [type]);
}
export function addpz(vals:number,type:number) {
    return getData(1492, [vals,type]);
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
// 查看销售折扣率设置
export function thenBuckleOne() {
    return getData(2115, []);
}
// 添加销售折扣率设置
export function addThenBuckle(vals:number) {
    return getData(2113, [vals]);
}
// 编辑销售折扣率设置
export function editThenBuckle(vals:number) {
    return getData(2114, [vals]);
}