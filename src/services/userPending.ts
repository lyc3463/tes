import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1599, [vals.phone,vals.name]);
}