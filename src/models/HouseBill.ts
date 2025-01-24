import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as HouseBillService from '@/services/houseBill';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import HouseBillType from '@/ModelTypes/TypeHouseBill';
import { fixPathname } from '@/utils/common';
let pl = {
    tenantId:0
};

export interface HouseBillCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface HouseBillInterface {
    namespace: 'HouseBill';
    state: Object;
    effects: {
        fetch: Effect;
        // fenye: Effect;
    };
    reducers: {
        list: Reducer<HouseBillType[]>;
        one: Reducer<HouseBillType>;
        count: Reducer<HouseBillCountState>;
    };
    subscriptions: { setup: Subscription };
}
const HouseBillModel: HouseBillInterface = {
    namespace: 'HouseBill',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(HouseBillService.fetch, payload?payload:pl);
            // if (res.ErrorCode == 0) {
            //     yield put({
            //         type: 'list',
            //         payload: { list: res.Data },
            //     });
            // } else {
            //     message.error(res.ErrorCode + res.Data);
            // }
            return res
        },
        // *fenye({ type, payload }, { put, call, select }): any {
        //     const res = yield call(HouseBillService.fetch, payload?payload:pl);
        //     if (res.ErrorCode == 0) {
        //         yield put({
        //             type: 'count',
        //             payload: { count: res.Data },
        //         });
        //     } else {
        //         message.error(res.ErrorCode + res.Data);
        //     }
        //
        // },
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

export default HouseBillModel;
