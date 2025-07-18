import {getData, postData} from '@/network/http';
export function add(phone:string,parkId:number) {
    return getData(1600, [phone,parkId]);
}
export function fenye1601() {
    return getData(1601, []);
}