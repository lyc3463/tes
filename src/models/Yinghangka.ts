import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as YinghangkaService from '@/services/yinghangka';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import YinghangkaType from '@/ModelTypes/TypeYinghangka';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    phone:''
}

export interface YinghangkaCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface YinghangkaInterface {
    namespace: 'Yinghangka';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<YinghangkaType[]>;
        one: Reducer<YinghangkaType>;
        count: Reducer<YinghangkaCountState>;
    };
    subscriptions: { setup: Subscription };
}
const YinghangkaModel: YinghangkaInterface = {
    namespace: 'Yinghangka',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(YinghangkaService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Yinghangka.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(YinghangkaService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(YinghangkaService.edit, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result

        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(YinghangkaService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
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
                if (StaticInfo.userId > 0 && pathname === '/qianbao/yinghangka/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }


            });
        },
    },
};

export default YinghangkaModel;
