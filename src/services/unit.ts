import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1138, [vals.page,vals.name,vals.beginRents,vals.endRents,vals.status,vals.house_id]);
}
export function fetchFenye(vals:any) {
    return getData(1139, [vals.name,vals.beginRents,vals.endRents,vals.status,vals.house_id]);
}

export function add(vals:any) {
    return getData(1134, [vals.house_id,vals.unit_name,vals.floor_area,vals.rentable_area,vals.floorz,vals.rent,vals.price,vals.unit_type,vals.add_area]);
}

export function edit(vals:any) {
    return getData(1135, [vals.uid,vals.house_id,vals.unit_name,vals.floor_area,vals.rentable_area,vals.floor,vals.rent,vals.price,vals.unit_type,vals.add_area]);

}

export function remove(vals:any) {
    return getData(1136, [vals]);
}
export function one(vals:any) {
    return getData(1137, [vals]);
}

export function stutesUnit(vals:any) {
    return getData(1446, [vals.house_id]);

}