import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as DuizhangService from '@/services/duizhang';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import DuizhangType from '@/ModelTypes/TypeDuizhang';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50

}

export interface DuizhangState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface DuizhangInterface {
    namespace: 'Duizhang';
    state: Object;
    effects: {
        fetch: Effect;
        add: Effect;
        fenye:Effect;
    };
    reducers: {
        list: Reducer<DuizhangType[]>;
        one: Reducer<DuizhangType>;
        count: Reducer<DuizhangState>;
    };
    subscriptions: { setup: Subscription };
}
const DuizhangModels: DuizhangInterface = {
    namespace: 'Duizhang',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(DuizhangService.fetch,payload?payload:pl);
            console.log(res);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(DuizhangService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(DuizhangService.fenye,payload?payload:pl);

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
                if (StaticInfo.userId > 0 && pathname === '/billLog/yinghangka/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/billLog/yinghangka/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default DuizhangModels;
