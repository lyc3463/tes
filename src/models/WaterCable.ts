import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as WaterCableService from '@/services/waterCable';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import WaterCableType from '@/ModelTypes/TypeWaterCable';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    collector_id:'',
    name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01'
}

export interface WaterCableState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface WaterCableInterface {
    namespace: 'WaterCable';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
        shoudong: Effect;
    };
    reducers: {
        list: Reducer<WaterCableType[]>;
        one: Reducer<WaterCableType>;
        count: Reducer<WaterCableState>;
    };
    subscriptions: { setup: Subscription };
}
const WaterCableModel: WaterCableInterface = {
    namespace: 'WaterCable',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(WaterCableService.fetch, payload?payload:pl);
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
            const res = yield call(WaterCableService.fenye,payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *shoudong({ payload, callback }, { call, put, take }): any {
            const result = yield call(WaterCableService.shoudongdian);
            yield put({ type: 'fetch', payload:pl });
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
                if (StaticInfo.userId > 0 && pathname === '/MeterReading/waterCable/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/MeterReading/waterCable/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default WaterCableModel;
