import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as PropertiesService from '@/services/properties';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import PropertiesType from '@/ModelTypes/TypeProperties';
import { fixPathname } from '@/utils/common';
import * as BannerService from "@/services/banner";
let pl={
    name:''
}

export interface PropertiesCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface PropertiesInterface {
    namespace: 'Properties';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<PropertiesType[]>;
        one: Reducer<PropertiesType>;
        count: Reducer<PropertiesCountState>;
    };
    subscriptions: { setup: Subscription };
}
const PropertiesModel: PropertiesInterface = {
    namespace: 'Properties',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(PropertiesService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Gongsi.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(PropertiesService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(PropertiesService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload ,callback}, { call, put }): any {
            const result = yield call(PropertiesService.remove, payload);
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

                // 楼盘列表
                if (StaticInfo.userId > 0 && pathname === '/appletManage/properties/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }

                // 添加房源获取楼盘列表
                if (StaticInfo.userId > 0 && pathname === '/appletManage/addResources/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                // 修改房源获取楼盘列表
                if (StaticInfo.userId > 0 && pathname === '/appletManage/editResources/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default PropertiesModel;
