import { getData } from '@/network/http';

export function fetch(vals:string) {
    return getData(1428, [vals]);
}
export function fenye(vals:string) {
    return getData(1427, [vals]);
}

export function one() {
    return getData(1429, []);
}
