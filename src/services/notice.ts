import {getData, postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1071, [vals.allNoticeName,vals.beginTimeNotice,vals.endTimeNotice]);
}
export function add(vals:any) {
    return postData(1068, [vals.park_status=1,vals.noticeDate,vals.title],vals.notice_content);
}

export function edit(vals:any) {
    // return getData(1012, []);
}

export function remove(vals:any) {
    return getData(1070, [vals]);
}



