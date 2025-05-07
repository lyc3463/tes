import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as MonthlyCardService from '@/services/monthlyCard';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import MonthlyBillType from '@/ModelTypes/TypeMonthlyBill';
import { fixPathname } from '@/utils/common';
import * as NoticeService from "@/services/notice";
let pl={
    page:1,
    appId:0,
    carNo:''
}

export interface MonthlyBillState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface MonthlyBillInterface {
    namespace: 'MonthlyCard';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
        loogoo: Effect;
    };
    reducers: {
        list: Reducer<MonthlyBillType[]>;
        one: Reducer<MonthlyBillType>;
        count: Reducer<MonthlyBillState>;
    };
    subscriptions: { setup: Subscription };
}
const MonthlyCardModel: MonthlyBillInterface = {
    namespace: 'MonthlyCard',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(MonthlyCardService.fetch, payload?payload:pl);
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
            const res = yield call(MonthlyCardService.fenye, payload?payload:pl);
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
        *loogoo({ payload, callback }, { call, put, take }): any {
            const result = yield call(MonthlyCardService.loogoo, payload);
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

export default MonthlyCardModel;
