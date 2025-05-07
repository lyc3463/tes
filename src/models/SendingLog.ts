import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as SendingLogServer from '@/services/sendingLog';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import SendingLogType from '@/ModelTypes/TypeSendingLog';
import { fixPathname } from '@/utils/common';
let pl={
    current:1,
    phone:'',
    starTime:'2000-01-01',
    endTime:'2099-01-01',
    pageSize:50
}


export interface SendingLogCountState {
    smsCount: number;
    smsPageTotal: number;
}

export interface SendingLogInterface {
    namespace: 'SendingLog';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<SendingLogType[]>;
        one: Reducer<SendingLogType>;
        count: Reducer<SendingLogCountState>;
    };
    subscriptions: { setup: Subscription };
}
const SendingLogModel: SendingLogInterface = {
    namespace: 'SendingLog',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {

            const res = yield call(SendingLogServer.fetch,payload?payload:pl);

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

            const res = yield call(SendingLogServer.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/message/sendingLog/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/message/sendingLog/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default SendingLogModel;
