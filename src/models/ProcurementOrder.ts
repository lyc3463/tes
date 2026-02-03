import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as Application from '@/services/application';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import StaffType from '@/ModelTypes/TypeStaff';
import { fixPathname } from '@/utils/common';
import * as PreferentialService from "@/services/preferential";
let pl={
    page:1,
    orderCode:'',
    warehouseName:'',
    supplierName:'',
    pageSize:50,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    orderStatus:2,
    billStatus:0,
    orderType:0
}
export interface StaffCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface StaffInterface {
    namespace: 'ProcurementOrder';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        payment: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<StaffType[]>;
        one: Reducer<StaffType>;
        count: Reducer<StaffCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ProcurementOrderModel: StaffInterface = {
    namespace: 'ProcurementOrder',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(Application.fetch, payload?payload:pl);
            console.log('res',res);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *payment({ payload, callback }, { call, put, take }): any {
            const result = yield call(PreferentialService.payment, payload);
            yield put({ type: 'fetch', payload: pl });
            yield put({ type: 'fenye', payload: pl });
            yield take('fetch/@@end');
            return result
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
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(Application.fenye,payload?payload:pl);
            if (res.ErrorCode == 0) {
                console.log('分页信息',res);
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

export default ProcurementOrderModel;
