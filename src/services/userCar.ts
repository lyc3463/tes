import {getData, postData} from '@/network/http';
export function fetch(vals:any) {
    return getData(1521, [vals.page,vals.carNo,vals.userId,vals.stutes,vals.pageSize,vals.userType,vals.uName,vals.uPhone]);
}
export function fenye(vals:any) {
    return getData(1660, [vals.carNo,vals.name,vals.stutes,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1517, [vals.appId, vals.carNo, vals.carColor, vals.carType,vals.driversLicense,vals.vehicleLicense,2,vals.remark]);
}
export function edit(vals:any) {
    return getData(1518, [vals.uid,vals.carNo, vals.carColor, vals.carType,vals.driversLicense,vals.vehicleLicense]);
}
export function remove(vals:any) {
    return getData(1519, [vals]);
}
export function one(vals:any) {
    return getData(1520, [vals]);
}
export function check(vals:any) {
    return getData(1532, [vals.uid,vals.status]);
}

// 获取园区套餐
export function getItemList() {
    return getData(1516, []);
}
// 根据车牌查询车辆信息
export function reactCarNo(vals:any) {
    return getData(1537, [vals]);
}
// 开通月保
export function adyuebao(itemID:string,useName:string,userId:string,carNum:number,phone:string,money:number,purchaseMonth:number,startDate:string,endDate:string,carID:number) {
    return getData(1525, [itemID,useName,userId,carNum,phone,money,purchaseMonth,startDate,endDate,carID,2,0]);
}
// 月卡延期
export function edityuebaoInfo(tcId:string,parkServiceId:string,purchaseMonth:number,startDate:string,endDate:string,money:number,appid:number,beginTime:string
) {
    return getData(1530, [tcId,parkServiceId,purchaseMonth,startDate,endDate,money,appid,2,beginTime]);
}
// 月卡变更
export function edityuebao(itemId:string,parkServiceId:string,placeNum:number,carId:number) {
    return getData(1527, [itemId,parkServiceId,placeNum,carId]);
}
// 根据车牌查询车辆信息并且添加月卡记录
export function getInfoAndAdd(carNo:string,appid:number,userName:string,userId:string) {
    return getData(1534, [carNo,appid,userName,userId,2]);
}