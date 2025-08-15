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
import {fetch1598} from "@/services/payReportForms";
let pl={
    name:'',
    phone:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
}


export interface PayReportFormsCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface PayReportFormsInterface {
    namespace: 'AppUserPayReportForms';
    state: Object;
    effects: {
        fetch: Effect;
        // fenye: Effect;
    };
    reducers: {
        list: Reducer<PayReportFormsType[]>;
        one: Reducer<PayReportFormsType>;
        count: Reducer<PayReportFormsCountState>;
    };
    subscriptions: { setup: Subscription };
}
const AppUserPayReportFormsModel: PayReportFormsInterface = {
    namespace: 'AppUserPayReportForms',
    state: {},
    effects: {
        *fetch({ type, payload ,callback }, { put, call, select }): any {
            const res = yield call(payReportFormsService.fetch1598, payload?payload:pl);
            console.log('列表',res);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
                if (callback) callback(0);
            } else {
                message.error(res.ErrorCode + res.Data);
                if (callback) callback(-1);
            }
            return res;
        },
        // *fenye({ type, payload }, { put, call, select }): any {
        //     const res = yield call(payReportFormsService.fenye,payload?payload:pl);
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
                // if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/payReportForms/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/payReportForms/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default AppUserPayReportFormsModel;
