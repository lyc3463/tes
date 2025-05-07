import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ByStagesService from '@/services/byStages';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import ByStagesType from '@/ModelTypes/TypeByStages';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    phone:'',
    stutes:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50
}


export interface ByStagesCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface ByStagesInterface {
    namespace: 'ByStages';
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
        list: Reducer<ByStagesType[]>;
        one: Reducer<ByStagesType>;
        count: Reducer<ByStagesCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ByStagesModel: ByStagesInterface = {
    namespace: 'ByStages',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {

            const res = yield call(ByStagesService.fetch, payload?payload:pl);
            // const resc = yield call(
            //   GongsiService.fetchcount,
            //   _.omit(pl, ['page']),
            // );
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
            const list = yield select((state: any) => state.ByStages.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(ByStagesService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(ByStagesService.edit, payload);
            yield put({ type: 'fetch', payload:pl });
            yield take('fetch/@@end');
            return result
        },
        *check({ payload, callback }, { call, put, take }): any {
            const result = yield call(ByStagesService.check, payload);
            yield put({ type: 'fetch', payload:pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(ByStagesService.remove, payload);
            yield put({ type: 'fetch', payload:pl});
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(ByStagesService.fenye,payload?payload:pl);
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

export default ByStagesModel;
