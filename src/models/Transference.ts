import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as TransferenceService from '@/services/transference';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TransferenceType from '@/ModelTypes/TypeTransference';
import { fixPathname } from '@/utils/common';
import * as RenameService from "@/services/rename";
let pl={
    page:1,
    phone:'',
    stutes:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
}


export interface TransferenceCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface TransferenceInterface {
    namespace: 'Transference';
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
        list: Reducer<TransferenceType[]>;
        one: Reducer<TransferenceType>;
        count: Reducer<TransferenceCountState>;
    };
    subscriptions: { setup: Subscription };
}
const TransferenceModel: TransferenceInterface = {
    namespace: 'Transference',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {

            const res = yield call(TransferenceService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Transference.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(TransferenceService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(TransferenceService.edit, payload);
            yield put({ type: 'fetch', payload:pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(TransferenceService.remove, payload);
            yield put({ type: 'fetch', payload:pl});
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(TransferenceService.fenye,payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(TransferenceService.check, payload);
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
                if (StaticInfo.userId > 0 && pathname === '/enter/transference/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/transference/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/afterSales/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/afterSales/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/check/checkTransference/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/check/checkTransference/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/check/checkAfterSales/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/check/checkAfterSales/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default TransferenceModel;
