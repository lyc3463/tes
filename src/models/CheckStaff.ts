import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as StaffService from '@/services/staff';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import StaffType from '@/ModelTypes/TypeStaff';
import { fixPathname } from '@/utils/common';
import {editzs} from "@/services/staff";
let pl={
    page:1,
    identifier:'',
    contractType:0,
    contractStatus:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    name:'',
    pageSize:50
}
export interface StaffCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface StaffInterface {
    namespace: 'CheckStaff';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        addzs: Effect;
        adddj: Effect;
        editzs: Effect;
        editdj: Effect;
        remove: Effect;
        check: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<StaffType[]>;
        one: Reducer<StaffType>;
        count: Reducer<StaffCountState>;
    };
    subscriptions: { setup: Subscription };
}
const CheckStaffModel: StaffInterface = {
    namespace: 'CheckStaff',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(StaffService.fetch, payload?payload:pl);
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
        *addzs({ payload }, { call, put,take}): any {
            const result = yield call(StaffService.addzs, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;
        },
        *adddj({ payload }, { call, put,take}): any {
            const result = yield call(StaffService.adddj, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;
        },

        *editzs({ payload, callback }, { call, put, take }): any {
            const result = yield call(StaffService.editzs, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *editdj({ payload, callback }, { call, put, take }): any {
            const result = yield call(StaffService.editdj, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(StaffService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;
        },
        *check({ payload }, { call, put,take}): any {
            const result = yield call(StaffService.check, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(StaffService.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/check/checkContracte/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/check/checkContracte/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default CheckStaffModel;
