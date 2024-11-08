import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as DateWaterService from '@/services/dateWater';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import DateWaterType from '@/ModelTypes/TypeDateWater';
import { fixPathname } from '@/utils/common';
import dayjs from "dayjs";
const today = new Date();
const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, -1);
let pl={
    startDate:dayjs(startOfDay).format("YYYY-MM-DD HH:mm:ss"),
    endDate:dayjs(endOfDay).format("YYYY-MM-DD HH:mm:ss")
};
export interface DateWaterCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface DateWaterInterface {
    namespace: 'DateWater';
    state: Object;
    effects: {
        dayfetch: Effect;
        moonfetch: Effect;
        yearfetch: Effect;
    };
    reducers: {
        daylist: Reducer<DateWaterType[]>;
        moonlist: Reducer<DateWaterType[]>;
        yearlist: Reducer<DateWaterType[]>;
        one: Reducer<DateWaterType>;
        daycount: Reducer<DateWaterCountState>;
        mooncount: Reducer<DateWaterCountState>;
        yearcount: Reducer<DateWaterCountState>;
    };
    subscriptions: { setup: Subscription };
}
const DateWaterModel: DateWaterInterface = {
    namespace: 'DateWater',
    state: {},
    effects: {
        *dayfetch({ type, payload }, { put, call, select }): any {
            const res = yield call(DateWaterService.dayfetch, payload);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'daylist',
                    payload: { daylist: res.Data.list },
                });
                yield put({
                    type: 'daycount',
                    payload: { daycount: res.Data.energySum},
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *moonfetch({ type, payload }, { put, call, select }): any {
            const res = yield call(DateWaterService.moonfetch, payload);
            console.log(res)
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'moonlist',
                    payload: { moonlist: res.Data.list},
                });
                yield put({
                    type: 'mooncount',
                    payload: { mooncount: res.Data.energySum},
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *yearfetch({ type, payload }, { put, call, select }): any {
            const res = yield call(DateWaterService.yearfetch, payload);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'yearlist',
                    payload: { yearlist: res.Data.list },
                });
                yield put({
                    type: 'yearcount',
                    payload: { yearcount: res.Data.energySum},
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
    },
    reducers: {
        moonlist(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        yearlist(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        daylist(state, action) {
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
        daycount(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        mooncount(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        yearcount(state, action) {
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
                // if (StaticInfo.userId > 0 && pathname === '/waterCableTrade/cableStatistics/') {
                //     dispatch({
                //         type: 'hourfetch',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default DateWaterModel;
