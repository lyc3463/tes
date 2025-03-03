import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as LinksService from '@/services/links';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import LinksType from '@/ModelTypes/TypeLinks';
import { fixPathname } from '@/utils/common';


export interface LinksCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface LinksInterface {
    namespace: 'Links';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<LinksType[]>;
        one: Reducer<LinksType>;
        count: Reducer<LinksCountState>;
    };
    subscriptions: { setup: Subscription };
}
const LinkModel: LinksInterface = {
    namespace: 'Links',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(LinksService.fetch, payload?payload:{name:''});
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
            const list = yield select((state: any) => state.Links.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(LinksService.add, payload);
            yield put({ type: 'fetch', payload: {name:''} });  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(LinksService.edit, payload);
            yield put({ type: 'fetch', payload: {name:''} });  // 重新加载数据
            yield take('fetch/@@end');
            return result

        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(LinksService.remove, payload);
            yield put({ type: 'fetch', payload: { name:'' } });
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
                // if (StaticInfo.userId > 0 && pathname === '/appletManage/links/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                //
                // // 添加房源获取楼盘列表
                // if (StaticInfo.userId > 0 && pathname === '/appletManage/addResources/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // // 修改房源获取楼盘列表
                // if (StaticInfo.userId > 0 && pathname === '/appletManage/editResources/') {
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

export default LinkModel;
