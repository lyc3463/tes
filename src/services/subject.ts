import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1089, [vals.name,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1086, [vals.name]);
}

export function edit(vals:any) {
    return getData(1087, [vals.uid,vals.subject_name]);
}

export function remove(vals:any) {
    return getData(1088, [vals]);
}
export function one(vals:any) {
    return getData(1090, [vals]);
}


