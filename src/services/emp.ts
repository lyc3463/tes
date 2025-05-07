import { getData,postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1173, [vals.page,vals.cname,vals.nickname,vals.phone,vals.stutes,vals.companyName,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1169, [vals.name,vals.nickname,vals.phone,vals.estarttime,vals.eendtime,vals.companyName,vals.jsonObtain,vals.oldImgName]);
}

export function edit(vals:any) {
    return getData(1170, [vals.uid,vals.name,vals.nickname,vals.phone,vals.estarttime,vals.eendtime,vals.companyName,vals.jsonObtain,vals.oldImgName]);
}

export function remove(vals:any) {
    return getData(1171, [vals]);
}

export function one(vals:any) {
    return getData(1172, [vals]);
}

export function check(vals:any) {
    return getData(1193, [vals.uid,vals.stutes=2]);
}
export function fenye(vals:any) {
    return getData(1174, [vals.cname,vals.nickname,vals.phone,vals.stutes,vals.companyName,vals.pageSize]);
}
export function checkRemove(vals:any) {
    return getData(1194, [vals]);
}


