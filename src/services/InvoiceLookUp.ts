import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1352, [vals.page,vals.name,vals.stutes,vals.openID]);
}

export function edit(vals:any) {
    return getData(1130, [vals.uid,vals.house_name,vals.floor_area,vals.rentable_area,vals.rents,vals.price,vals.address,vals.floors,vals.residue_add_area]);
}

export function remove(vals:any) {
    return getData(1350, [vals]);
}
export function one(vals:any) {
    return getData(1133, [vals]);
}
export function fenye(vals:any) {
    return getData(1353, [vals.name,vals.stutes,vals.openID]);
}
export function check(vals:any) {
    return getData(1354, [vals.uid,vals.stutes=2]);
}
