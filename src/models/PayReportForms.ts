import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as payReportFormsService from '@/services/payReportForms';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import PayReportFormsType from '@/ModelTypes/TypePayReportForms';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    phone:'',
    type:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    userID:0,
    pageSize:50
}


export interface PayReportFormsCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface PayReportFormsInterface {
    namespace: 'PayReportForms';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<PayReportFormsType[]>;
        one: Reducer<PayReportFormsType>;
        count: Reducer<PayReportFormsCountState>;
    };
    subscriptions: { setup: Subscription };
}
const PayReportFormsModel: PayReportFormsInterface = {
    namespace: 'PayReportForms',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(payReportFormsService.fetch, payload?payload:pl);
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
            const res = yield call(payReportFormsService.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/payReportForms/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/payReportForms/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default PayReportFormsModel;
