import { getData, send7777 } from '@/network/http';

export function get1001() {
    return getData(1001, [])
}

export function get1036(phone: string, t: number) {
    return getData(1036, [phone, t])
}

export function get8828(gid: string) {
    return getData(8828, [gid])
}

export function get8032() {
    return getData(8032, [])
}

export function get8018() {
    return getData(8018, [])
}

export function get7777(tc:number) {
    return send7777([tc]);
}

