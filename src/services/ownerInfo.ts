import { getData,postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1378, [vals.page,vals.name,vals.startDate,vals.endDate,vals.pageSize,vals.stutes]);
}
export function add(vals:any) {
    return postData(1374, [vals.customerName,vals.customerPhone,vals.customerAddress,vals.zuMoney,vals.manageFee,vals.deposit,vals.depositFee,vals.startDate,vals.endDate,vals
        .ownerName,vals.accountName,vals.ownerPhone,vals.ownerCard,vals.bankName,vals.imgNames,vals.payType,vals.dayNum],vals.jsonDate);
}

export function edit(vals:any) {
    return postData(1375, [vals.customerName,vals.customerPhone,vals.customerAddress,vals.zuMoney,vals.manageFee,vals.deposit,vals.depositFee,vals.startDate,vals.endDate,vals
        .ownerName,vals.accountName,vals.ownerPhone,vals.ownerCard,vals.bankName,vals.uid,vals.pdfName,vals.imgNames,vals.payType,vals.dayNum],vals.jsonDate);}

export function remove(vals:any) {
    return getData(1376, [vals.uid,vals]);
}
export function fenye(vals:any) {
    return getData(1379, [vals.name,vals.startDate,vals.endDate,vals.pageSize,vals.stutes]);
}
export function one(vals:any) {
    return getData(1377, [vals]);
}

export function check(vals:any) {
    return getData(1661, [vals.uid,vals.stutes]);
}

export function rentList(vals:any) {
    return getData(1662, [vals]);
}
export function PayownerBill(vals:any) {
    return getData(1663, [vals,2]);
}


