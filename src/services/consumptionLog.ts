import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1452, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}
export function fenye(vals:any) {
    return getData(1453, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}

export function fetch1(vals:any) {
    return getData(1590, [vals.page,vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}
export function fenye1(vals:any) {
    return getData(1591, [vals.name,vals.phone,vals.type,vals.startDate,vals.endDate,vals.userID,vals.pageSize]);
}
export function list(page:number,name:string,phone:string,type:number,startDate:string,endDate:string,userID:number,pageSize:number) {
    return getData(1162, [page,name,phone,type,startDate,endDate,userID,pageSize]);
}
export function listFenye(name:string,phone:string,type:number,startDate:string,endDate:string,userID:number,pageSize:number) {
    return getData(1163, [name,phone,type,startDate,endDate,userID,pageSize]);
}
