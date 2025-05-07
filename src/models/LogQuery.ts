import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as LogQueryService from '@/services/logQuery';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import LogQueryType from '@/ModelTypes/TypeLogQuery';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50
};

export interface LogQueryCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface LogQueryInterface {
    namespace: 'LogQuery';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
    };
    reducers: {
        list: Reducer<LogQueryType[]>;
        one: Reducer<LogQueryType>;
        count: Reducer<LogQueryCountState>;
    };
    subscriptions: { setup: Subscription };
}
const LogQueryModel: LogQueryInterface = {
    namespace: 'LogQuery',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(LogQueryService.fetch,payload?payload: pl);
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
            const res = yield call(LogQueryService.fenye,payload?payload: pl);
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
                if (StaticInfo.userId > 0 && pathname === '/logManage/logQuery/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/logManage/logQuery/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default LogQueryModel;
