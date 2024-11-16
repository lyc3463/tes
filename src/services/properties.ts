import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1056, [vals.name]);
}
export function add(vals:any) {
    return postData(1053, [
        vals.properties_title,
        vals.properties_address,
        vals.group,
        vals.property_company,
        vals.area_id,
        vals.renovation_id,
        vals.feature_id,
        vals.extent,
        vals.price,
        vals.business_register,
        vals.floor_height,
        vals.green_rate,
        vals.get_room_rate,
        vals.properties_status,
        vals.sort,
        vals.img,

    ], vals.singles);
}

export function edit(vals:any) {
    return postData(1054, [
        vals.uid,
        vals.properties_title,
        vals.properties_address,
        vals.group,
        vals.property_company,
        vals.area_id,
        vals.renovation_id,
        vals.feature_id,
        vals.extent,
        vals.price,
        vals.business_register,
        vals.floor_height,
        vals.green_rate,
        vals.get_room_rate,
        vals.properties_status,
        vals.sort,
        vals.img,
    ],vals.singles);
}

export function remove(vals:any) {
    return getData(1055, [vals]);
}
export function one(vals:any) {
    return getData(1057, [vals]);
}

// 根据楼盘id 去查找底下房源
export function getHouse(vals:any) {
    console.log(vals)
    return getData(1058, [vals]);
}