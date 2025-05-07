import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as WaterRateService from '@/services/waterRate';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import WaterRateType from '@/ModelTypes/TypeWaterRate';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    name:'',
    collectorID:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50
};

export interface WaterRateCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface HireInterface {
    namespace: 'WaterRate';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
    };
    reducers: {
        list: Reducer<WaterRateType[]>;
        one: Reducer<WaterRateType>;
        count: Reducer<WaterRateCountState>;
    };
    subscriptions: { setup: Subscription };
}
const WaterRateModel: HireInterface = {
    namespace: 'WaterRate',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(WaterRateService.fetch,payload?payload: pl);
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
            const res = yield call(WaterRateService.fenye,payload?payload: pl);
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
                if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/waterRate/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/waterRate/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default WaterRateModel;
