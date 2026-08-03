import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as RenewService from '@/services/renew';
import { message } from 'antd';
import _ from 'lodash';
import RenewType from '@/ModelTypes/TypeRenew';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    phone:'',
    stutes:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50
}


export interface RenewCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface RenewInterface {
    namespace: 'Renew';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        check: Effect;
        translation: Effect;
    };
    reducers: {
        list: Reducer<RenewType[]>;
        one: Reducer<RenewType>;
        count: Reducer<RenewCountState>;
    };
    subscriptions: { setup: Subscription };
}
const RenewModel: RenewInterface = {
    namespace: 'Renew',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(RenewService.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                console.log('res',res);
                yield put({
                    type: 'list',
                    payload: { list: res.Data.data },
                });
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Renew.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(RenewService.add, payload);
            // yield put({ type: 'fetch', payload: pl });
            // yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(RenewService.edit, payload);
            // yield put({ type: 'fetch', payload:pl });
            // yield take('fetch/@@end');
            return result
        },
        *translation({ payload, callback }, { call, put, take }): any {
            const result = yield call(RenewService.translation, payload);
            // yield put({ type: 'fetch', payload:pl });
            // yield take('fetch/@@end');
            return result
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(RenewService.check, payload);
            // yield put({ type: 'fetch', payload:pl });
            // yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(RenewService.remove, payload);
            // yield put({ type: 'fetch', payload:pl});
            // yield take('fetch/@@end');
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

            });
        },
    },
};

export default RenewModel;
