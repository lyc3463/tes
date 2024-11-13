import { info_event } from '@/Event/EventEnum';
import { EventMgr } from '@/Event/EventMgr';
import { getSendStr } from './utils';
import { StaticInfo } from '@/StaticInfo';
import { createSearchParams } from 'umi';
import {message} from "antd";


export async function getData(ActionId: number, canshus: any[]) {
    console.log("canshus",canshus)
    let sendstr = getSendStr(ActionId, canshus);
    return fetch(window.ServerConfig.apiServer + '?' + sendstr).then((_res: any) => {
        EventMgr.event(info_event.hideWait);
        const res = _res.json();
        let rez=res.then((res)=>{
            if (res.ErrorCode != 0) {
                if (res.ErrorCode == -6666) {
                    StaticInfo.userState = false;
                    sessionStorage.removeItem('userState')
                    EventMgr.event(info_event.ExitHttpLogin, res.Data);
                } else if (res.ErrorCode == -9999) {
                    StaticInfo.userState = false;
                    sessionStorage.removeItem('userState')
                    EventMgr.event(info_event.cuowu9999, res.Data);
                }else if (res.ErrorCode==-1300){
                    message.error('账号已在其他地方登录，为了账户安全请修改密码')
                }
                else {
                    if (res.Data != null) {
                        EventMgr.event(info_event.Error, res.Data);
                    }
                }
            }
        })

        return res;
    }
    ).catch(() => {
        StaticInfo.userState = false;
        // EventMgr.event(info_event.ExitHttpLogin, '网络异常，请求超时，请重新登录');
        return {
            ErrorCode: 20001,
            Data: '网络异常，请求超时'
        }
    });
}

// export async function postWithFiles(ActionId: number, canshus: any[], files: File[]) {
//     let sendstr = await getSendStr(ActionId, canshus);
//     let formData = new FormData();
//     formData.append("sendstr",sendstr);
//     formData.append("files":files);
//     return fetch(window.ServerConfig.apiServer, {
//         method: 'POST',
//         body: formData,
//     }).then((_res: any) => {
//             const res = _res.json();
//             EventMgr.event(info_event.hideWait);
//             if (res.ErrorCode != 0) {
//                 if (res.ErrorCode == -6666) {
//                     StaticInfo.userState = false;
//                     EventMgr.event(info_event.ExitHttpLogin, res.Data);
//                 } else if (res.ErrorCode == -9999) {
//                     StaticInfo.userState = false;
//                     EventMgr.event(info_event.cuowu9999, res.Data);
//                 }
//                 else {
//                     if (res.Data != null) {
//                         EventMgr.event(info_event.Error, res.Data);
//                     }
//                 }
//             }
//             return res;
//         }
//     ).catch(() => {
//         StaticInfo.userState = false;
//         // EventMgr.event(info_event.ExitHttpLogin, '网络异常，请求超时，请重新登录');
//         return {
//             ErrorCode: 20001,
//             Data: '网络异常，请求超时'
//         }
//     });
// }


export async function postData(ActionId: number, canshus: any[], b64data: string) {
    let sendstr = await getSendStr(ActionId, canshus);

    return fetch(window.ServerConfig.apiServer, {
        method: 'POST',
        body: JSON.stringify([sendstr, b64data]),
    }).then((_res: any) => {
        const res = _res.json();
        EventMgr.event(info_event.hideWait);
        if (res.ErrorCode != 0) {
            if (res.ErrorCode == -6666) {
                StaticInfo.userState = false;
                EventMgr.event(info_event.ExitHttpLogin, res.Data);
            } else if (res.ErrorCode == -9999) {
                StaticInfo.userState = false;
                EventMgr.event(info_event.cuowu9999, res.Data);
            }
            else {
                if (res.Data != null) {
                    EventMgr.event(info_event.Error, res.Data);
                }
            }
        }
        return res;
    }
    ).catch(() => {
        StaticInfo.userState = false;
        // EventMgr.event(info_event.ExitHttpLogin, '网络异常，请求超时，请重新登录');
        return {
            ErrorCode: 20001,
            Data: '网络异常，请求超时'
        }
    });
}

export async function send7777(canshus: any[]) {
    let sendstr = await getSendStr(7777, canshus);
    fetch(window.ServerConfig.apiServer + '?' + sendstr, { keepalive: true })
}
