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
    stutes:1,
    companyName:'',
    pageSize:50,
    tenantId:0,
}

export interface CustomState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface EmpInterface {
    namespace: 'Emp';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
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
    namespace: 'Emp',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(EmpService.fetch,payload?payload:pl);
            console.log('res',res)
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data.data },
                });
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
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

            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(EmpService.edit, payload);

            return result
        },
        *delete({ payload }, { call, put,take }): any {
            const result = yield call(EmpService.remove, payload);

            return result
        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(EmpService.remove, payload);

            return result
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

            });
        },
    },
};

export default EmpModels;
