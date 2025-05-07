import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ManualRechargeService from '@/services/manualRecharge';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import ManualRechargeType from '@/ModelTypes/TypeManualRecharge';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    stutes:0,
    pageSize:50
};

export interface ManualRechargeCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface ManualRechargeInterface {
    namespace: 'ManualRecharge';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
        check:Effect;
        remove:Effect;
        add:Effect;
        edit:Effect;
    };
    reducers: {
        list: Reducer<ManualRechargeType[]>;
        one: Reducer<ManualRechargeType>;
        count: Reducer<ManualRechargeCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ManualRechargeModel: ManualRechargeInterface = {
    namespace: 'ManualRecharge',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ManualRechargeService.fetch,payload?payload: pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(ManualRechargeService.fenye,payload?payload: pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(ManualRechargeService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(ManualRechargeService.check, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload, callback }, { call, put, take }): any {
            const result = yield call(ManualRechargeService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(ManualRechargeService.edit, payload);
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
                if (StaticInfo.userId > 0 && pathname === '/billLog/manualRecharge/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/billLog/manualRecharge/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default ManualRechargeModel;
