import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ResourcesService from '@/services/resources';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import ResourcesType from '@/ModelTypes/TypeResources';
import { fixPathname } from '@/utils/common';
import {fetchFenye} from "@/services/resources";
let pl={
    page:1,
    houingType:2,
    houingStatus:2,
    beginRentHousing:1,
    endRentHousing:80000000,
    beginPriceHousing:1,
    endPriceHousing:8000000,
    houesID:0,
    pageSize:50
}


export interface ResourcesCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface RenovationInterface {
    namespace: 'Resources';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fetchFenye: Effect;
    };
    reducers: {
        list: Reducer<ResourcesType[]>;
        one: Reducer<ResourcesType>;
        count: Reducer<ResourcesCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ResourcesModel: RenovationInterface = {
    namespace: 'Resources',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ResourcesService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Resources.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take}): any {
            const result = yield call(ResourcesService.add, payload);
            yield put({ type: 'fetch', payload: {...pl} });
            yield take('fetch/@@end');
            return result;
        },

        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(ResourcesService.edit, payload);
            yield put({ type: 'fetch', payload: {...pl} }); // 重新加载数据
            yield take('fetch/@@end');
            return result;

        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(ResourcesService.remove, payload);
            yield put({ type: 'fetch', payload: {...pl} });
            yield take('fetch/@@end');
            return result;
        },
        *fetchFenye({ payload }, { call, put,take}): any {
            const result = yield call(ResourcesService.fetchFenye, payload?payload:pl);
            if (result.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: result.Data },
                });
            } else {
                message.error(result.ErrorCode + result.Data);
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
                if (StaticInfo.userId > 0 && pathname === '/appletManage/resources/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/appletManage/resources/') {
                    dispatch({
                        type: 'fetchFenye',
                        payload: location.state,
                    });
                }
                // if (StaticInfo.userId > 0 && pathname === '/appletManage/addProperties/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/appletManage/editProperties/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (
                //     StaticInfo.userId > 0 &&
                //     pathname === '/xiangmu/gongsiguanli/detail/'
                // ) {
                //     dispatch({
                //         type: 'fetchOne',
                //         payload: location.state,
                //     });
                // }
            });
        },
    },
};

export default ResourcesModel;
