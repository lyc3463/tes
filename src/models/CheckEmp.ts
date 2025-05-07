import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as EmpService from '@/services/emp';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import EmpType from '@/ModelTypes/TypeEmp';
import { fixPathname } from '@/utils/common';

let pl={
    page:1,
    cname:'',
    nickname:'',
    phone:'',
    stutes:0,
    companyName:0,
    pageSize:50
}

export interface CustomState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface EmpInterface {
    namespace: 'CheckEmp';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fenye: Effect;
        delete: Effect;
        checkRemove: Effect;
        checkOK: Effect;
    };
    reducers: {
        list: Reducer<EmpType[]>;
        one: Reducer<EmpType>;
        count: Reducer<CustomState>;
    };
    subscriptions: { setup: Subscription };
}
const EmpModels: EmpInterface = {
    namespace: 'CheckEmp',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(EmpService.fetch,payload?payload:pl);

            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            }
            return res
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Emp.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(EmpService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(EmpService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *delete({ payload }, { call, put,take }): any {
            const result = yield call(EmpService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(EmpService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(EmpService.fenye,payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *checkRemove({ payload }, { call, put,take }): any {
            const result = yield call(EmpService.checkRemove, payload);
            return result
        },
        *checkOK({ payload }, { call, put,take }): any {
            const result = yield call(EmpService.check, payload);
            yield put({ type: 'fetch', payload: pl });
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

                if (StaticInfo.userId > 0 && pathname === '/check/checkStaff/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/check/checkStaff/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/AccessControlManage/AccessControlPurview/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default EmpModels;
