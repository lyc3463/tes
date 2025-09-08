import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as WorkOrderService from '@/services/workOrder';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import WaterRateType from '@/ModelTypes/TypeWaterRate';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    name:'',
    phone:'',
    stutes:0,
    userId:0,
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
    namespace: 'WorkOrder';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
        add:Effect;
        edit:Effect;
        remove:Effect;
        fenpei:Effect;
    };
    reducers: {
        list: Reducer<WaterRateType[]>;
        one: Reducer<WaterRateType>;
        count: Reducer<WaterRateCountState>;
    };
    subscriptions: { setup: Subscription };
}
const WorkOrderModel: HireInterface = {
    namespace: 'WorkOrder',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(WorkOrderService.fetch,payload?payload: pl);
            console.log(res)
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res;
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(WorkOrderService.fenye,payload?payload: pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(WorkOrderService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenpei({ payload, callback }, { call, put, take }): any {
            const result = yield call(WorkOrderService.fenpei, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(WorkOrderService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put ,take}): any {
            const result = yield call(WorkOrderService.remove, payload);
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
                // if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/waterRate/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/waterRate/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default WorkOrderModel;
