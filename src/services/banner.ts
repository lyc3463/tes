import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1033, [vals.name]);
}

export function add(vals:any) {
    return getData(1030, [vals.biaohao,vals.single,vals.isxianshi]);
}


export function edit(vals:any) {
    return getData(1031, [vals.uid,vals.carousel_name,vals.single,vals.carouselStatus]);
}

export function remove(vals:any) {
    return getData(1032, [vals]);
}

export function one(vals:string) {
    return getData(1034, [vals]);
}

