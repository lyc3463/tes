import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ReleaseSlipService from '@/services/releaseSlip';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import HouseType from '@/ModelTypes/TypeCable';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    pageSize:50,
    startDate:'2000-01-01',
    endDate:'2099-12-31',
    status:0,
    name:'',
    phone:'',
    userID:0
};

export interface HouseCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface HouseInterface {
    namespace: 'ReleaseSlip';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        remove: Effect;
        fenye: Effect;
        edit: Effect;
        check: Effect;
        release: Effect;
    };
    reducers: {
        list: Reducer<HouseType[]>;
        one: Reducer<HouseType>;
        count: Reducer<HouseCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ReleaseSlipModel: HouseInterface = {
    namespace: 'ReleaseSlip',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ReleaseSlipService.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.House.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(ReleaseSlipService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(ReleaseSlipService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(ReleaseSlipService.check, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *release({ payload, callback }, { call, put, take }): any {
            const result = yield call(ReleaseSlipService.release, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(ReleaseSlipService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(ReleaseSlipService.fenye, payload?payload:pl);
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
                // if (StaticInfo.userId > 0 && pathname === '/houseManage/editUnit/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/addCable/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/editCable/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/gateManage/addDevice/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
            });
        },
    },
};

export default ReleaseSlipModel;
