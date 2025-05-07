import { getData } from '@/network/http';

export function fetch(vals:any) {
    return getData(1083, [vals.name,vals.companyId,vals.pageSize]);
}

export function add(vals:any) {
    return getData(1080, [vals.name,vals.company_id]);
}

export function edit(vals:any) {
    return getData(1081, [vals.uid,vals.project_name,vals.company_id]);
}

// 获取当前项目底下包含的信息
export function getContainInfo(vals:any) {
    return getData(1085, [vals]);
}
export function one(vals:any) {
    return getData(1084, [vals]);
}



// 强制删除
export function remove(vals:any) {
    return getData(1082, [vals]);
}

