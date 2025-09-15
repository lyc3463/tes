import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as OwnerInfoService from '@/services/ownerInfo';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import OwnerInfoType from '@/ModelTypes/TypeOwnerInfo';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50,
    stutes:0
}
export interface OwnerInfoCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface OwnerInfoInterface {
    namespace: 'OwnerInfo';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fenye: Effect;
        check: Effect;
    };
    reducers: {
        list: Reducer<OwnerInfoType[]>;
        one: Reducer<OwnerInfoType>;
        count: Reducer<OwnerInfoCountState>;
    };
    subscriptions: { setup: Subscription };
}
const OwnerInfoModel: OwnerInfoInterface = {
    namespace: 'OwnerInfo',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(OwnerInfoService.fetch, payload?payload:pl);
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
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Staff.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take}): any {
            const result = yield call(OwnerInfoService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;
        },

        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(OwnerInfoService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(OwnerInfoService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;
        },
        *check({ payload }, { call, put,take}): any {
            const result = yield call(OwnerInfoService.check, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(OwnerInfoService.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/contract/ownerInfo/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }


            });
        },
    },
};

export default OwnerInfoModel;
