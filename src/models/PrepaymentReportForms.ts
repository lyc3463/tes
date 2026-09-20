import {
    Effect,
    Reducer,
    Subscription,
} from 'umi';
import { message } from 'antd';
import * as prepaymentReportFormsService from '@/services/prepaymentReportForms';

let pl = {
    page: 1,
    name: '',
    phone: '',
    startDate: '2000-01-01',
    endDate: '2099-01-01',
    pageSize: 50,
};

export interface PrepaymentReportFormsCountState {
    count: number;
    total: number;
}

export interface PrepaymentReportFormsInterface {
    namespace: 'PrepaymentReportForms';
    state: Object;
    effects: {
        fetch: Effect;
    };
    reducers: {
        list: Reducer<any[]>;
        count: Reducer<PrepaymentReportFormsCountState>;
    };
    subscriptions: { setup: Subscription };
}

const PrepaymentReportFormsModel: PrepaymentReportFormsInterface = {
    namespace: 'PrepaymentReportForms',
    state: {},
    effects: {
        *fetch({ payload, callback }, { put, call }): any {
            const res = yield call(prepaymentReportFormsService.fetch, payload ? payload : pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data.data },
                });
                yield put({
                    type: 'count',
                    payload: { count: res.Data.count, total: res.Data.total },
                });
                if (callback) callback(0);
            } else {
                message.error(res.ErrorCode + res.Data);
                if (callback) callback(-1);
            }
            return res;
        },
    },
    reducers: {
        list(state, action) {
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
        setup() {
            return () => {};
        },
    },
};

export default PrepaymentReportFormsModel;