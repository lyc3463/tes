import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CarManageService from '@/services/carManage';
import { message } from 'antd';
import _ from 'lodash';
import CarManageType from '@/ModelTypes/TypeCarManage';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    carNo:'',
    appId:0,
    stutes:0,
    pageSize:50
}

export interface CarManageCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface CarManageInterface {
    namespace: 'CarManage';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fenye: Effect;
        check: Effect;
    };
    reducers: {
        list: Reducer<CarManageType[]>;
        one: Reducer<CarManageType>;
        count: Reducer<CarManageCountState>;
    };
    subscriptions: { setup: Subscription };
}
const CarManageModels: CarManageInterface = {
    namespace: 'CarManage',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CarManageService.fetch, payload?payload:pl);

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
            const list = yield select((state: any) => state.Account.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(CarManageService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *check({ payload }, { call, put,take }): any {
            const result = yield call(CarManageService.check, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(CarManageService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(CarManageService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(CarManageService.fenye,payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
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

export default CarManageModels;
