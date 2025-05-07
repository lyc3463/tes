import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as InvoiceLookUpService from '@/services/InvoiceLookUp';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TypeInvoiceLookUp from '@/ModelTypes/TypeInvoiceLookUp';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    name:'',
    stutes:0,
    openID:0,
    pageSize:50
};

export interface InvoiceLookUpCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface InvoiceLookUpInterface {
    namespace: 'InvoiceLookUp';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
        check:Effect;
        remove:Effect;
        edit:Effect;
    };
    reducers: {
        list: Reducer<TypeInvoiceLookUp[]>;
        one: Reducer<TypeInvoiceLookUp>;
        count: Reducer<InvoiceLookUpCountState>;
    };
    subscriptions: { setup: Subscription };
}
const InvoiceLookUpModel: InvoiceLookUpInterface = {
    namespace: 'InvoiceLookUp',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(InvoiceLookUpService.fetch,payload?payload: pl);
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
            const res = yield call(InvoiceLookUpService.fenye,payload?payload: pl);
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
            const result = yield call(InvoiceLookUpService.check, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload, callback }, { call, put, take }): any {
            const result = yield call(InvoiceLookUpService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(InvoiceLookUpService.edit, payload);
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
                if (StaticInfo.userId > 0 && pathname === '/enter/invoiceLookUp/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/invoiceLookUp/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default InvoiceLookUpModel;
