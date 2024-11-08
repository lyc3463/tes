import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as TenantInfoService from '@/services/tenantInfo';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TenantInfoType from '@/ModelTypes/TypeTenantInfo';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    content:'',
    phone:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    stutes:0,
    openid:''
}

export interface TenantInfoState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface TenantInfoInterface {
    namespace: 'TenantInfo';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<TenantInfoType[]>;
        one: Reducer<TenantInfoType>;
        count: Reducer<TenantInfoState>;
    };
    subscriptions: { setup: Subscription };
}
const TenantInfoModels: TenantInfoInterface = {
    namespace: 'TenantInfo',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(TenantInfoService.fetch,payload?payload:pl);
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
            const list = yield select((state: any) => state.TenantInfo.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(TenantInfoService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(TenantInfoService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put }): any {
            const result = yield call(TenantInfoService.remove, payload);
            if (result.status !== 'ok') {
                alert('cuowu');
            }
            yield put({ type: 'fetch', payload: { page: 1 } });
            UmiHistorty.replace({
                pathname: '../user/list',
            });
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(TenantInfoService.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/propertyServerManage/tenantInfo/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/propertyServerManage/tenantInfo/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default TenantInfoModels;
