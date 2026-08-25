import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ThingListvice from '@/services/thingList';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import StaffType from '@/ModelTypes/TypeStaff';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    code:'',
    name:'',
    pageSize:50,
    goodsTypeId:0,
}
export interface StaffCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface StaffInterface {
    namespace: 'ThingList';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        edit: Effect;
        fenye: Effect;
        add: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<StaffType[]>;
        one: Reducer<StaffType>;
        count: Reducer<StaffCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ThingListModel: StaffInterface = {
    namespace: 'ThingList',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ThingListvice.fetch, payload?payload:pl);
            console.log(res);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data.data },
                });
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
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
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(ThingListvice.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *remove({ payload, callback }, { call, put, take }): any {
            const result = yield call(ThingListvice.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(ThingListvice.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result;

        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(ThingListvice.fenye,payload?payload:pl);
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
            });
        },
    },
};

export default ThingListModel;
