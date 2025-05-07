import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as outRentService from '@/services/outZu';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import OutRentType from '@/ModelTypes/TypeOuzu';
import { fixPathname } from '@/utils/common';
import {addremark} from "@/services/outZu";
let pl={
    page:1,
    name:'',
    phone:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50
}


export interface OutRentCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface OutRentInterface {
    namespace: 'OutZu';
    state: Object;
    effects: {
        fetch: Effect;
        add: Effect;
        fenye: Effect;
        addremark: Effect;
    };
    reducers: {
        list: Reducer<OutRentType[]>;
        one: Reducer<OutRentType>;
        count: Reducer<OutRentCountState>;
    };
    subscriptions: { setup: Subscription };
}
const OutZuModel: OutRentInterface = {
    namespace: 'OutZu',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(outRentService.fetch, payload?payload:pl);
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
        *add({ payload }, { call, put,take}): any {
            const result = yield call(outRentService.add, payload);
            yield put({ type: 'fetch', payload:pl});
            yield take('fetch/@@end');
            return result
        },
        *addremark({ payload }, { call, put,take}): any {
            const result = yield call(outRentService.addremark, payload);
            yield put({ type: 'fetch', payload:pl});
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(outRentService.fenye,payload?payload:pl);
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

export default OutZuModel;
