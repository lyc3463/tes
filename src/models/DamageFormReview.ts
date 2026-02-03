import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as RequisitionForm from '@/services/requisitionForm';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import StaffType from '@/ModelTypes/TypeStaff';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    orderCode:'',
    warehouseName:'',
    pageSize:50,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    orderStatus:0,
    billStatus:0,
    orderType:3
}
export interface StaffCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface StaffInterface {
    namespace: 'DamageFormReview';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        edit: Effect;
        fenye: Effect;
        check: Effect;
        add: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<StaffType[]>;
        one: Reducer<StaffType>;
        count: Reducer<StaffCountState>;
    };
    subscriptions: { setup: Subscription };
}
const DamageFormReviewModel: StaffInterface = {
    namespace: 'DamageFormReview',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(RequisitionForm.fetch, payload?payload:pl);
            console.log('审核领用订单',res);
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
            const list = yield select((state: any) => state.Staff.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(RequisitionForm.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *remove({ payload, callback }, { call, put, take }): any {
            const result = yield call(RequisitionForm.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(RequisitionForm.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(RequisitionForm.check, payload);
            yield put({ type: 'DamageForm/fetch', payload: {page:1, orderCode:'', warehouseName:'', pageSize:50, startDate:'2000-01-01', endDate:'2099-01-01', orderStatus:1, billStatus:0, orderType:3} });
            yield put({ type: 'fetch', payload: pl });
            yield take('DamageForm/fetch/@@end');
            yield take('fetch/@@end');
            return result;

        },

        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(RequisitionForm.fenye,payload?payload:pl);
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

export default DamageFormReviewModel;
