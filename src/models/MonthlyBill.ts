import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as MonthlyBillService from '@/services/monthlyBill';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import MonthlyBillType from '@/ModelTypes/TypeMonthlyBill';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    type:2,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    tenantId:0
}

export interface MonthlyBillState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface MonthlyBillInterface {
    namespace: 'MonthlyBill';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<MonthlyBillType[]>;
        one: Reducer<MonthlyBillType>;
        count: Reducer<MonthlyBillState>;
    };
    subscriptions: { setup: Subscription };
}
const MonthlyBillModel: MonthlyBillInterface = {
    namespace: 'MonthlyBill',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(MonthlyBillService.fetch, payload?payload:pl);
            // const resc = yield call(
            //   GongsiService.fetchcount,
            //   _.omit(pl, ['page']),
            // );
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
            const res = yield call(MonthlyBillService.fenye, pl);
            // const resc = yield call(
            //   GongsiService.fetchcount,
            //   _.omit(pl, ['page']),
            // );
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
                if (StaticInfo.userId > 0 && pathname === '/billLog/monthlyBill/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/billLog/monthlyBill/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default MonthlyBillModel;
