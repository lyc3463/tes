import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as RechargeService from '@/services/recharge';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import RechargeType from '@/ModelTypes/TypeRecharge';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    stutes:0
}

export interface RechargeCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface RechargeInterface {
    namespace: 'Recharge';
    state: Object;
    effects: {
        fetch: Effect;
        add: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<RechargeType[]>;
        one: Reducer<RechargeType>;
        count: Reducer<RechargeCountState>;
    };
    subscriptions: { setup: Subscription };
}
const RechargeModel: RechargeInterface = {
    namespace: 'Recharge',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(RechargeService.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(RechargeService.add, payload);
            // yield put({ type: 'fetch', payload: pl });
            // yield take('fetch/@@end');
            return result
        },

        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(RechargeService.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/message/chongzhiLog/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/message/chongzhiLog/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default RechargeModel;
