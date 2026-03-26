import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as BillService from '@/services/bill';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import BillType from '@/ModelTypes/TypeBill';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    orderCode:'',
    company_name:'',
    account_card:'',
    project_name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50,
    orderStatus:0,
    moneyType:0,
    supplierId:0,
    foType:1,
    paidStatus:0,
    expenseCode:'',
}

export interface BiaoqianCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface BiaoqianInterface {
    namespace: 'Bill';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        check: Effect;
        fenye:Effect;
        reject:Effect;
        payment:Effect;
        // fetchNo:Effect;
    };
    reducers: {
        list: Reducer<BillType[]>;
        one: Reducer<BillType>;
        count: Reducer<BiaoqianCountState>;
    };
    subscriptions: { setup: Subscription };
}
const BillModel: BiaoqianInterface = {
    namespace: 'Bill',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(BillService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Bill.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(BillService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *payment({ payload, callback }, { call, put, take }): any {
            const result = yield call(BillService.payment, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(BillService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(BillService.check, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *reject({ payload, callback }, { call, put, take }): any {
            const result = yield call(BillService.reject, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        // *allCheck({ payload, callback }, { call, put, take }): any {
        //     const result = yield call(BillService.allCheck, payload);
        //     yield put({ type: 'fetch', payload: pl });
        //     yield take('fetch/@@end');
        //     return result
        // },
        *remove({ payload ,callback}, { call, put ,take}): any {
            const result = yield call(BillService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(BillService.fenye,payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        // *fetchNo({ type, payload }, { put, call, select }): any {
        //     const res = yield call(BillService.fetchNo, payload?payload:pl);
        //     if (res.ErrorCode == 0) {
        //         yield put({
        //             type: 'list',
        //             payload: { list: res.Data },
        //         });
        //     } else {
        //         message.error(res.ErrorCode + res.Data);
        //     }
        //     return res
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

export default BillModel;
