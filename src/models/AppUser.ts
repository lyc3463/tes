import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as AppUserService from '@/services/appUser';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TypeAppUser from '@/ModelTypes/TypeAppUser';
import { fixPathname } from '@/utils/common';
import * as AccountService from "@/services/account";
let pl={
    page:1,
    name:'',
    phone:''
}

export interface AppUserCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface AppUserInterface {
    namespace: 'AppUser';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
        edit: Effect;
    };
    reducers: {
        list: Reducer<TypeAppUser[]>;
        one: Reducer<TypeAppUser>;
        count: Reducer<AppUserCountState>;
    };
    subscriptions: { setup: Subscription };
}
const AppUserModels: AppUserInterface = {
    namespace: 'AppUser',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(AppUserService.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(AppUserService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(AppUserService.fenye,payload?payload:pl);
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

                if (StaticInfo.userId > 0 && pathname === '/kehu/wcxuserlist/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/kehu/wcxuserlist/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/kehu/byzhuhu/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/kehu/editByzhuhu/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/propertyServerManage/addTenantInfo/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default AppUserModels;
