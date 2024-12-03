import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as WenjuanService from '@/services/wenjuan';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import WenjuanType from '@/ModelTypes/TypeWenjuan';
import { fixPathname } from '@/utils/common';
let pl = {
    name:'',
    is_enable:2,
};

export interface WenjuanCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface WenjuanInterface {
    namespace: 'Wenjuan';
    state: Object;
    effects: {
        fetch: Effect;
        // fenye:Effect;
        edit:Effect;
        add:Effect;
        remove:Effect;
        offison:Effect;
    };
    reducers: {
        list: Reducer<WenjuanType[]>;
        one: Reducer<WenjuanType>;
        count: Reducer<WenjuanCountState>;
    };
    subscriptions: { setup: Subscription };
}
const WenjuanModel: WenjuanInterface = {
    namespace: 'Wenjuan',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(WenjuanService.fetch,payload?payload: pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(WenjuanService.edit, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result

        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(WenjuanService.add, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload, callback }, { call, put, take }): any {
            const result = yield call(WenjuanService.remove, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
        *offison({ payload, callback }, { call, put, take }): any {
            const result = yield call(WenjuanService.offison, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
        // *fenye({ type, payload }, { put, call, select }): any {
        //     const res = yield call(WenjuanService.fenye,payload?payload: pl);
        //     if (res.ErrorCode == 0) {
        //         yield put({
        //             type: 'count',
        //             payload: { count: res.Data },
        //         });
        //     } else {
        //         message.error(res.ErrorCode + res.Data);
        //     }
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

export default WenjuanModel;
