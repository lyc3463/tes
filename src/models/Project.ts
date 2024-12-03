import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ProjectService from '@/services/project';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import ProjectType from '@/ModelTypes/TypeProject';
import { fixPathname } from '@/utils/common';
let pl={
    name:''
}

export interface ProjectCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface ProjectInterface {
    namespace: 'Project';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<ProjectType[]>;
        one: Reducer<ProjectType>;
        count: Reducer<ProjectCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ProjectModel: ProjectInterface = {
    namespace: 'Project',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ProjectService.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Project.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take}): any {
            const result = yield call(ProjectService.add, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result;
        },
        *edit({ payload, callback }, { call, put, take }): any {
                const result = yield call(ProjectService.edit, payload);
                yield put({ type: 'fetch', payload: pl });  // 重新加载数据
                return result

        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(ProjectService.remove, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
    },
    reducers: {
        list(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        one(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        count(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
    subscriptions: {
        setup({ dispatch, history }, done) {
            return history.listen(({ location, action }) => {
                const pathname = fixPathname(location.pathname);

                if (StaticInfo.userId > 0 && pathname === '/financeManage/list/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/financeManage/projectList/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/financeManage/addAccountList/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/financeManage/editSubjectList/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/addFinancialData/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/financialDataInfo/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/editFinancialData/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default ProjectModel;
