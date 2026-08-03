import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CheckFpService from '@/services/checkFpSD';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import CheckFpType from '@/ModelTypes/TypeCheckFp';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    stutes:0,
    openId:0,
    pageSize:50,
    riseName:'',
    tenantName:'',
    type:0,
    phone:''
}

export interface CheckFpCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface CheckFpInterface {
    namespace: 'CheckFpSD';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
        check: Effect;

    };
    reducers: {
        list: Reducer<CheckFpType[]>;
        one: Reducer<CheckFpType>;
        count: Reducer<CheckFpCountState>;
    };
    subscriptions: { setup: Subscription };
}
const CheckFpSDModels: CheckFpInterface = {
    namespace: 'CheckFpSD',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CheckFpService.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data.data },
                });
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(CheckFpService.fenye, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(CheckFpService.check, payload);
            // yield put({ type: 'fetch', payload: pl });
            // yield take('fetch/@@end');
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
                // if (StaticInfo.userId > 0 && pathname === '/enter/addPreferential/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default CheckFpSDModels;
