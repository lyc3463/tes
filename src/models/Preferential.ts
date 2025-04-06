import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as PreferentialService from '@/services/preferential';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import PreferentialType from '@/ModelTypes/TypePreferential';
import { fixPathname } from '@/utils/common';
import {check} from "@/services/preferential";
let pl={
    page:1,
    phone:'',
    stutes:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
}


export interface PreferentialCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface PreferentialInterface {
    namespace: 'Preferential';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fenye: Effect;
        check: Effect;
    };
    reducers: {
        list: Reducer<PreferentialType[]>;
        one: Reducer<PreferentialType>;
        count: Reducer<PreferentialCountState>;
    };
    subscriptions: { setup: Subscription };
}
const PreferentialModel: PreferentialInterface = {
    namespace: 'Preferential',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {

            const res = yield call(PreferentialService.fetch, payload?payload:pl);
            // const resc = yield call(
            //   GongsiService.fetchcount,
            //   _.omit(pl, ['page']),
            // );
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Preferential.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(PreferentialService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(PreferentialService.edit, payload);
            yield put({ type: 'fetch', payload:pl });
            yield take('fetch/@@end');
            return result
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(PreferentialService.check, payload);
            yield put({ type: 'fetch', payload:pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(PreferentialService.remove, payload);
            yield put({ type: 'fetch', payload:pl});
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(PreferentialService.fenye,payload?payload:pl);
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

export default PreferentialModel;
