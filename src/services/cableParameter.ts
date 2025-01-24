import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1143, [vals.cname,vals.priceType,vals.we_type]);
}

export function add(vals:any) {
    return getData(1140, [
        vals.we_type,
        vals.price_name,
        vals.price_type,
        vals.base_price1,
        vals.additional_price1,
        vals.loss,
        vals.every_price,
        vals.base_price2,
        vals.additional_price2,
        vals.base_price3,
        vals.additional_price3,
        vals.base_price4,
        vals.additional_price4,
        vals.base_price5,
        vals.additional_price5,
        vals.step_value1,
        vals.base_price6,
        vals.additional_price6,
        vals.step_value2,
        vals.base_price7,
        vals.additional_price7,
        vals.step_value3,
        vals.base_price8,
        vals.additional_price8,
        vals.step_value4,
        vals.base_price9,
        vals.additional_price9,
        vals.add_price_remark,
        vals.is_appPrice,
    ]);
}


export function edit(vals:any) {
    return getData(1141, [
        vals.uid,
        vals.we_type,
        vals.price_name,
        vals.price_type,
        vals.base_price1,
        vals.additional_price1,
        vals.loss,
        vals.every_price,
        vals.base_price2,
        vals.additional_price2,
        vals.base_price3,
        vals.additional_price3,
        vals.base_price4,
        vals.additional_price4,
        vals.base_price5,
        vals.additional_price5,
        vals.step_value1,
        vals.base_price6,
        vals.additional_price6,
        vals.step_value2,
        vals.base_price7,
        vals.additional_price7,
        vals.step_value3,
        vals.base_price8,
        vals.additional_price8,
        vals.step_value4,
        vals.base_price9,
        vals.additional_price9,
        vals.add_price_remark,
        vals.is_appPrice,
    ]);
}

export function remove(vals:any) {
    return getData(1142, [vals]);
}

export function one(vals:string) {
    return getData(1144, [vals]);
}

