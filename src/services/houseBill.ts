import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1426, [vals.tenantId]);
}
export function fenye() {
    return getData(1427, []);
}