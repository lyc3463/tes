import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as StatisticsInfoService from '@/services/statisticsInfo';
import { message } from 'antd';
import _ from 'lodash';
import StatisticsInfoType from '@/ModelTypes/TypeStatisticsInfo';
import { fixPathname } from '@/utils/common';
import dayjs from "dayjs";
const today = new Date();
const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, -1);
let pl={
    page:1,
    cid:'',
    name:'',
    startDate:dayjs(startOfDay).format("YYYY-MM-DD HH:mm:ss"),
    endDate:dayjs(endOfDay).format("YYYY-MM-DD HH:mm:ss")
}
export interface StatisticsInfoCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface StatisticsInfoInterface {
    namespace: 'StatisticsInfo';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<StatisticsInfoType[]>;
        one: Reducer<StatisticsInfoType>;
        count: Reducer<StatisticsInfoCountState>;
    };
    subscriptions: { setup: Subscription };
}
const StatisticsInfoModel: StatisticsInfoInterface = {
    namespace: 'StatisticsInfo',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(StatisticsInfoService.fetch, payload?payload:pl);
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
            const res = yield call(StatisticsInfoService.fenye,payload?payload:pl);
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
                // if (StaticInfo.userId > 0 && pathname === '/enter/staff/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/enter/staff/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }
            });
        },
    },
};

export default StatisticsInfoModel;
