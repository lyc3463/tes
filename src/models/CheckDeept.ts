import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CustomService from '@/services/checkDeept';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import CustomType from '@/ModelTypes/TypeCustom';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    phone:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    tenantId:0,
    stutes:0,
    pageSize:50
}

export interface CustomState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface CustomInterface {
    namespace: 'CheckDeept';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        remove: Effect;
        check: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<CustomType[]>;
        one: Reducer<CustomType>;
        count: Reducer<CustomState>;
    };
    subscriptions: { setup: Subscription };
}
const CheckDeeptModels: CustomInterface = {
    namespace: 'CheckDeept',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CustomService.fetch,payload?payload:pl);
            console.log('ress',res)
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Custom.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(CustomService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(CustomService.check, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(CustomService.fenye,payload?payload:pl);
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
                // if (StaticInfo.userId > 0 && pathname === '/check/checkCustom/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/enter/checkCustom/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }
            });
        },
    },
};

export default CheckDeeptModels;
