import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as WatertService from '@/services/watert';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import WatertType from '@/ModelTypes/TypeWatert';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    remark:'',
    waterAddress:'',
    pageSize:50
}

export interface WatertCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface WatertInterface {
    namespace: 'Watert';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<WatertType[]>;
        one: Reducer<WatertType>;
        count: Reducer<WatertCountState>;
    };
    subscriptions: { setup: Subscription };
}
const WatertModels: WatertInterface = {
    namespace: 'Watert',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(WatertService.fetch, payload?payload:pl);
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
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(WatertService.fenye, payload?payload:pl);
            console.log('水表分页信息',res)
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Watert.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(WatertService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(WatertService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(WatertService.remove, payload);
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

                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/water/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/water/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default WatertModels;
