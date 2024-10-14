import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1132, [vals.name,vals.beginRents,vals.endRents]);
}

export function add(vals:any) {
    return getData(1129, [vals.house_name,vals.floor_area,vals.rentable_area,vals.rents,vals.price,vals.address,vals.floors,vals.residue_add_area]);
}

export function edit(vals:any) {
    return getData(1130, [vals.uid,vals.house_name,vals.floor_area,vals.rentable_area,vals.rents,vals.price,vals.address,vals.floors,vals.residue_add_area]);
}

export function remove(vals:any) {
    // return getData(1013, []);
}
export function one(vals:any) {
    return getData(1133, [vals]);
}

