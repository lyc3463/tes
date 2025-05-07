import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1066, [vals.page,vals.houingType,vals.houingStatus,vals.beginRentHousing,vals.endRentHousing,vals.beginPriceHousing,vals.endPriceHousing,vals.houesID,vals.pageSize]);
}
export function fetchFenye(vals:any) {
    return getData(1067, [vals.houingType,vals.houingStatus,vals.beginRentHousing,vals.endRentHousing,vals.beginPriceHousing,vals.endPriceHousing,vals.houesID,vals.pageSize]);
}
export function add(vals:any) {
    return postData(1062, [
        vals.housing_name,
        vals.housing_type,
        vals.properties_id,
        vals.housing_extent,
        vals.price,
        vals.rent,
        vals.payment_method,
        vals.shortest_tenancy,
        vals.decoration_situation,
        vals.surrounding_facilities,
        vals.housing_layout,
        vals.housing_characteristic,
        vals.housing_status,
        vals.sort,
        vals.single,
    ],vals.singles);
}
export function edit(vals:any) {
    return postData(1063, [
        vals.uid,
        vals.housing_name,
        vals.housing_type,
        vals.properties_id,
        vals.housing_extent,
        vals.price,
        vals.rent,
        vals.payment_method,
        vals.shortest_tenancy,
        vals.decoration_situation,
        vals.surrounding_facilities,
        vals.housing_layout,
        vals.housing_characteristic,
        vals.housing_status,
        vals.sort,
        vals.img,

    ],vals.singles);
}

export function remove(vals:any) {
    return getData(1064, [vals]);
}
export function one(vals:any) {
    return getData(1065, [vals]);
}

