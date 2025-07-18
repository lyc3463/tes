import { getData } from '@/network/http';

export function fetch() {
    return getData(1593, []);
}