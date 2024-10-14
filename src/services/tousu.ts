import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1212, [vals.page,vals.name,vals.phone,vals.state,vals.startDate,vals.endDate]);
}

export function add(vals:any) {
    // return getData(1086, [vals.name,vals.company_id,vals.project_id]);
}

export function edit(vals:any) {
    // return getData(1087, [vals.uid,vals.subject_name,vals.company_id,vals.project_id]);
}

export function remove(vals:any) {
    // return getData(1013, []);
}
export function one(vals:any) {
    // return getData(1090, [vals]);
}


