import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as EnterAmountService from '@/services/enterAmount';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import EnterAmountType from '@/ModelTypes/TypeEnterAmount';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
}

export interface EnterAmountCustomState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface EnterAmountInterface {
    namespace: 'EnterAmount';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        edit: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<EnterAmountType[]>;
        one: Reducer<EnterAmountType>;
        count: Reducer<EnterAmountCustomState>;
    };
    subscriptions: { setup: Subscription };
}
const EnterAmountModels: EnterAmountInterface = {
    namespace: 'EnterAmount',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(EnterAmountService.fetch,payload?payload:pl);
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
            const list = yield select((state: any) => state.EnterAmount.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(EnterAmountService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },

        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(EnterAmountService.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/billLog/enterAmount/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/billLog/enterAmount/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default EnterAmountModels;
