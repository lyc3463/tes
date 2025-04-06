import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ZuhuService from '@/services/zuhu';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import ZuhuType from '@/ModelTypes/TypeZuhu';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    phone:'',
    pagecount:50
}

export interface ZuhuCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface ZuhuInterface {
    namespace: 'Zuhu';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        byzhuhu: Effect;
        fenye: Effect;
        editAbloue: Effect;
        newbyzhuhu: Effect;
        newbyappuser: Effect;
    };
    reducers: {
        list: Reducer<ZuhuType[]>;
        one: Reducer<ZuhuType>;
        count: Reducer<ZuhuCountState>;
    };
    subscriptions: { setup: Subscription };
}
const WatertModels: ZuhuInterface = {
    namespace: 'Zuhu',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ZuhuService.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Zuhu.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(ZuhuService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(ZuhuService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put }): any {
            const result = yield call(ZuhuService.remove, payload);
            if (result.status !== 'ok') {
                alert('cuowu');
            }
            yield put({ type: 'fetch', payload: { page: 1 } });
            UmiHistorty.replace({
                pathname: '../user/list',
            });
        },
        *byzhuhu({ payload, callback }, { call, put, take }): any {
            const result = yield call(ZuhuService.byzhuhu, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *newbyzhuhu({ payload, callback }, { call, put, take }): any {
            const result = yield call(ZuhuService.newbyzhuhu, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *newbyappuser({ payload, callback }, { call, put, take }): any {
            const result = yield call(ZuhuService.newbyappuser, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *editAbloue({ payload, callback }, { call, put, take }): any {
            const result = yield call(ZuhuService.editAbloue, payload);
            return result
        },
        *fenye({ payload }, { call, put,take }): any {
            const res = yield call(ZuhuService.fenye, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res
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
                if (StaticInfo.userId > 0 && pathname === '/kehu/zuhulist/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/kehu/zuhulist/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/kehu/zuhuguanlian/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/kehu/zuhuguanlian/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default WatertModels;
