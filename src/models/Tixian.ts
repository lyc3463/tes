import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as TixianService from '@/services/tixian';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TixianType from '@/ModelTypes/TypeTixian';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    stutes:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50
}

export interface TixianCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface TixianInterface {
    namespace: 'Tixian';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<TixianType[]>;
        one: Reducer<TixianType>;
        count: Reducer<TixianCountState>;
    };
    subscriptions: { setup: Subscription };
}
const TixianModel: TixianInterface = {
    namespace: 'Tixian',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(TixianService.fetch, payload?payload:pl);
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
            const res = yield call(TixianService.fenye, payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/qianbao/tixian/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/qianbao/tixian/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default TixianModel;
