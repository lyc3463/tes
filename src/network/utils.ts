import { StaticInfo } from '@/StaticInfo';
import { stringToHex } from '@/utils/common';
import moment from 'moment';
import { createSearchParams } from 'umi';
import {replaceEnglishCommasWithChinese} from "@/utils/OpenTool";


function getStr(...str: string[]): string {
    let res = '';
    for (let i = 0; i < str.length - 1; i++) {
        // res += str[i];
        res += replaceEnglishCommasWithChinese(str[i]);
        res += ',';
    }
    // console.log(replaceEnglishCommasWithChinese(str[i]));
    res += str[str.length - 1];
    return res;
}

export function getSendStr(ActionId: number, canshus: any[]) {
    let d = StaticInfo.deviceId;
    let t = ActionId == 1001 ? moment().valueOf() : moment().valueOf() + StaticInfo.csx + 98765;
    let UserId = StaticInfo.userState ? StaticInfo.userId : 0;
    let cmdInfo = '';
    console.log("canshus",canshus);
    if (canshus.length > 0) {
        cmdInfo = getStr(...canshus);
    }
    let signstr ;
    if(UserId>0)signstr= [ActionId, UserId, cmdInfo, t, d,StaticInfo.token].join('&');
    else signstr = [ActionId, UserId, cmdInfo, t, d].join('&');
    // console.log(signstr);
    let sign = StaticInfo.rsaEncrypt(signstr);
    console.log('sign',sign);
    let sendobj = {
        ActionId,
        UserId,
        cmdInfo,
        t,
        d,
        sign
    }
    console.log(sendobj)
    let sendstr = window.btoa(window.encodeURIComponent(JSON.stringify(sendobj)));//.replaceAll('+', ' ')
    console.log(sendstr);
    return sendstr;
}