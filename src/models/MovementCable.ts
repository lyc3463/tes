import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as MovementCableService from '@/services/movementCable';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import MovementCableType from '@/ModelTypes/TypeMovementCable';
import { fixPathname } from '@/utils/common';
import * as TravelRecordService from "@/services/travelRecord";
let pl={
    page:1,
    collector_id:'',
    name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    tenant:0,
}

export interface MovementCableState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface MovementCableInterface {
    namespace: 'MovementCable';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
        shoudong: Effect;
    };
    reducers: {
        list: Reducer<MovementCableType[]>;
        one: Reducer<MovementCableType>;
        count: Reducer<MovementCableState>;
    };
    subscriptions: { setup: Subscription };
}
const MovementCableModel: MovementCableInterface = {
    namespace: 'MovementCable',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(MovementCableService.fetch, payload?payload:pl);
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
            const res = yield call(MovementCableService.fenye,payload?payload:pl);
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
            const result = yield call(MovementCableService.shoudongdian);
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
                if (StaticInfo.userId > 0 && pathname === '/MeterReading/movementCable/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/MeterReading/movementCable/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default MovementCableModel;
