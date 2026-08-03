import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as UsersService from '@/services/users';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import UsersType from '@/ModelTypes/TypeUsers';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    phone:'',
    is_zb:1
}

export interface UsersCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface SubjectInterface {
    namespace: 'Users';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        deactivate: Effect;
    };
    reducers: {
        list: Reducer<UsersType[]>;
        one: Reducer<UsersType>;
        count: Reducer<UsersCountState>;
    };
    subscriptions: { setup: Subscription };
}
const UsersModel: SubjectInterface = {
    namespace: 'Users',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(UsersService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Users.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(UsersService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(UsersService.edit, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result

        },
        *deactivate({ payload, callback }, { call, put, take }): any {
            const result = yield call(UsersService.deactivate, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result

        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(UsersService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        // *fenye({ payload }, { call, put,take }): any {
        //     const res = yield call(UsersService.fenye, payload?payload:pl);
        //
        //     if (res.ErrorCode == 0) {
        //         yield put({
        //             type: 'count',
        //             payload: { count: res.Data },
        //         });
        //     } else {
        //         message.error(res.ErrorCode + res.Data);
        //     }
        // },
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

                if (StaticInfo.userId > 0 && pathname === '/systemManage/userManage/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/propertyServerManage/reportLog/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                // if (StaticInfo.userId > 0 && pathname === '/systemManage/userManage/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }
            });
        },
    },
};

export default UsersModel;
