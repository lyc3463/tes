import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as GateService from '@/services/gate';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import GateType from '@/ModelTypes/TypeGate';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    deviceSn:'',
    pageSize:50
}

export interface AccountCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface GateInterface {
    namespace: 'Gate';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fenye: Effect;
        synchronous: Effect;
    };
    reducers: {
        list: Reducer<GateType[]>;
        one: Reducer<GateType>;
        count: Reducer<AccountCountState>;
    };
    subscriptions: { setup: Subscription };
}
const GateModels: GateInterface = {
    namespace: 'Gate',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(GateService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Gate.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(GateService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *synchronous({ payload }, { call, put,take }): any {
            const result = yield call(GateService.synchronous, payload);
            // yield put({ type: 'fetch', payload: pl });
            // yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(GateService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put }): any {
            const result = yield call(GateService.remove, payload);
            if (result.status !== 'ok') {
                alert('cuowu');
            }
            yield put({ type: 'fetch', payload: { page: 1 } });
            UmiHistorty.replace({
                pathname: '../user/list',
            });
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(GateService.fenye, payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/gateManage/device/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/gateManage/device/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/gateManage/addGrouping/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/gateManage/editGrouping/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default GateModels;
