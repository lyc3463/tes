import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as SubjectService from '@/services/subject';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import SubjectType from '@/ModelTypes/TypeSubject';
import { fixPathname } from '@/utils/common';
let pl={
    name:'',
}

export interface ProjectCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface SubjectInterface {
    namespace: 'Subject';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<SubjectType[]>;
        one: Reducer<SubjectType>;
        count: Reducer<ProjectCountState>;
    };
    subscriptions: { setup: Subscription };
}
const SubjectModel: SubjectInterface = {
    namespace: 'Subject',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(SubjectService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Subject.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(SubjectService.add, payload);
            yield put({type: 'fetch', payload: pl});  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(SubjectService.edit, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result

        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(SubjectService.remove, payload);
            yield put({ type: 'fetch', payload:pl });
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
                if (StaticInfo.userId > 0 && pathname === '/financeManage/subjectList/') {
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

export default SubjectModel;
