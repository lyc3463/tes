import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ResultService from '@/services/result';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import ResultType from '@/ModelTypes/TypeResult';
import { fixPathname } from '@/utils/common';
let pl={
    name:''
}

export interface ResultCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface ResultInterface {
    namespace: 'Result';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<ResultType[]>;
        one: Reducer<ResultType>;
        count: Reducer<ResultCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ResultModel: ResultInterface = {
    namespace: 'Result',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ResultService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Result.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(ResultService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(ResultService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload ,callback}, { call, put }): any {
            const result = yield call(ResultService.remove, payload);
            if (result.ErrorCode==0){
                yield put({ type: 'fetch', payload: pl });
                message.success('删除成功')
                return result
            }else {
                yield put({ type: 'fetch', payload: pl });
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
                if (StaticInfo.userId > 0 && pathname === '/appletManage/wenjuanList/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default ResultModel;
