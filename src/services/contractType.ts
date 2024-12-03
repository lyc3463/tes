import {getData, postData} from '@/network/http';
export function one(vals:any) {
    return getData(1409, [vals]);
}
export function add(companyName,companyAddress,rentAddress,openName,openBank,bankCard,templateType,legalPerson,phone,contacts,documentImage,attractPhone,attractWXNumber,reportPhone,reportEmail,attract,elePice,waterPice,eleloss) {
    return getData(1407, [companyName,companyAddress,rentAddress,openName,openBank,bankCard,templateType,legalPerson,phone,contacts,documentImage,attractPhone,attractWXNumber,reportPhone,reportEmail,attract,elePice,waterPice,eleloss]);
}
export function edit(uid,companyName,companyAddress,rentAddress,openName,openBank,bankCard,templateType,legalPerson,phone,contacts,documentImage,attractPhone,attractWXNumber,reportPhone,reportEmail,attract,elePice,waterPice,eleloss) {
    return getData(1408, [uid,companyName,companyAddress,rentAddress,openName,openBank,bankCard,templateType,legalPerson,phone,contacts,documentImage,attractPhone,attractWXNumber,reportPhone,reportEmail,attract,elePice,waterPice,eleloss]);
}