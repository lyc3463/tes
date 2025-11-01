import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ConsumptionLogService from '@/services/consumptionLog';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import ConsumptionLogType from '@/ModelTypes/TypeConsumptionLog';
import { fixPathname } from '@/utils/common';
import {oldFenye, oldFetch} from "@/services/consumptionLog";
let pl={
    page:1,
    name:'',
    phone:'',
    type:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    userID:0,
    pageSize:50
}

export interface ConsumptionLogState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface ConsumptionLogInterface {
    namespace: 'OldConsumptionLog';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<ConsumptionLogType[]>;
        one: Reducer<ConsumptionLogType>;
        count: Reducer<ConsumptionLogState>;
    };
    subscriptions: { setup: Subscription };
}
const OldConsumptionLogModel: ConsumptionLogInterface = {
    namespace: 'OldConsumptionLog',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ConsumptionLogService.oldFetch, payload?payload:pl);
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
            const res = yield call(ConsumptionLogService.oldFenye, payload?payload:pl);
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
            });
        },
    },
};

export default OldConsumptionLogModel;
