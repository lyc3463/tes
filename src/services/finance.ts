import { getData,postData} from '@/network/http';

export function fetch(vals:any) {
    return getData(1310, [vals.page,vals.abstract,vals.startDate,vals.endDate,vals.stutes,vals.type,vals.companyId,vals.projectId,vals.subjectId]);
}

export function fenye(vals:any) {
    return getData(1311, [vals.abstract,vals.startDate,vals.endDate,vals.stutes,vals.type,vals.companyId,vals.projectId,vals.subjectId]);
}