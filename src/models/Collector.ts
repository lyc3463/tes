import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CollectorService from '@/services/collector';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import CollectorType from '@/ModelTypes/TypeCollector';
import { fixPathname } from '@/utils/common';
import * as BannerService from "@/services/banner";
import * as CableService from "@/services/cable";
let pl={
    page:1,
    collector_number:'',
    stutes:2,
}

export interface CollectorCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface CollectorInterface {
    namespace: 'Collector';
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
        list: Reducer<CollectorType[]>;
        one: Reducer<CollectorType>;
        count: Reducer<CollectorCountState>;
    };
    subscriptions: { setup: Subscription };
}
const AccountModels: CollectorInterface = {
    namespace: 'Collector',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CollectorService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Collector.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(CollectorService.add, payload);
            // yield put({ type: 'fetch', payload: pl });
            // yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            let p2={
                page:1,
                collector_number:'',
                stutes:2,
            }
            const result = yield call(CollectorService.edit, payload);
            // yield put({ type: 'fetch', payload: {p2} });
            // yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put }): any {
            const result = yield call(CollectorService.remove, payload);
            if (result.status !== 'ok') {
                alert('cuowu');
            }
            yield put({ type: 'fetch', payload: { page: 1 } });
            UmiHistorty.replace({
                pathname: '../user/list',
            });
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(CollectorService.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/waterCableManage/collector/') {
                        dispatch({
                            type: 'fetch',
                            payload: location.state,
                        });
                    }
                if (StaticInfo.userId > 0 && pathname === '/waterCableManage/addCable/') {
                        dispatch({
                            type: 'fetch',
                            payload: location.state,
                        });
                    }
                if (StaticInfo.userId > 0 && pathname === '/waterCableManage/editCable/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/waterCableManage/addWater/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/waterCableManage/editWater/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/waterCableManage/collector/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default AccountModels;
