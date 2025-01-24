import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as SumHounsBliiService from '@/services/sumHounsBlii';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import SumHounsBliiType from '@/ModelTypes/TypeSumHounsBlii';
import { fixPathname } from '@/utils/common';
let pl = {
    tenantId:0
};

export interface SumHounsBliiCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface SumHounsBliiInterface {
    namespace: 'SumHounsBlii';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<SumHounsBliiType[]>;
        one: Reducer<SumHounsBliiType>;
        count: Reducer<SumHounsBliiCountState>;
    };
    subscriptions: { setup: Subscription };
}
const SumHounsBliiModel: SumHounsBliiInterface = {
    namespace: 'SumHounsBlii',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(SumHounsBliiService.fetch, payload?payload:pl);
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
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(SumHounsBliiService.fetch, payload?payload:pl);
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

export default SumHounsBliiModel;
