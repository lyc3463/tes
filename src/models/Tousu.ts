import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as TousuService from '@/services/tousu';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TousuType from '@/ModelTypes/TypeTousu';
import { fixPathname } from '@/utils/common';
import * as TenantInfoService from "@/services/tenantInfo";
let pl={
    page:1,
    name:'',
    phone:'',
    state:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
};

export interface ProjectCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface TousuInterface {
    namespace: 'Tousu';
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
        list: Reducer<TousuType[]>;
        one: Reducer<TousuType>;
        count: Reducer<ProjectCountState>;
    };
    subscriptions: { setup: Subscription };
}
const TousuModel: TousuInterface = {
    namespace: 'Tousu',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(TousuService.fetch, pl);
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
            const list = yield select((state: any) => state.Tousu.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(TousuService.add, payload);
            yield put({type: 'fetch', payload: {}});  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(TousuService.edit, payload);
            yield put({ type: 'fetch', payload: {name:''} });  // 重新加载数据
            // yield take('fetch/@@end');
            return result

        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(TousuService.remove, payload);
            yield put({ type: 'fetch', payload: {name:''} });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(TousuService.fenye,payload?payload:pl);
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

                if (StaticInfo.userId > 0 && pathname === '/propertyServerManage/complaint/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                } 
                if (StaticInfo.userId > 0 && pathname === '/propertyServerManage/complaint/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default TousuModel;
