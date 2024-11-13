import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as FinanceService from '@/services/finance';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import FinanceType from '@/ModelTypes/TypeFinance';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    abstract:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    stutes:1,
    type:2
}

export interface FinanceCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface FinanceInterface {
    namespace: 'Finance';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;

    };
    reducers: {
        list: Reducer<FinanceType[]>;
        one: Reducer<FinanceType>;
        count: Reducer<FinanceCountState>;
    };
    subscriptions: { setup: Subscription };
}
const FinanceModel: FinanceInterface = {
    namespace: 'Finance',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(FinanceService.fetch, payload?payload:pl);
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
            const res = yield call(FinanceService.fenye, payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/finance/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/finance/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default FinanceModel;
