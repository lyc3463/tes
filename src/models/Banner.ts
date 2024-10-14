import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as BannerService from '@/services/banner';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import BannerType from '@/ModelTypes/TypeBanner';
import { fixPathname } from '@/utils/common';
let pl={
    name:''
}

export interface BannerCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface GongsiInterface {
    namespace: 'Banner';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<BannerType[]>;
        one: Reducer<BannerType>;
        count: Reducer<BannerCountState>;
    };
    subscriptions: { setup: Subscription };
}
const BannerModel: GongsiInterface = {
    namespace: 'Banner',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(BannerService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Banner.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(BannerService.add, payload);
            if (result.ErrorCode==0){
                yield put({ type: 'fetch', payload: pl });
            }
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(BannerService.edit, payload);
            if (result.ErrorCode==0){
                yield put({ type: 'fetch', payload: pl });
            }
            return result
        },
        *remove({ payload ,callback}, { call, put ,take}): any {
            const result = yield call(BannerService.remove, payload);
            if (result.ErrorCode==0){
                yield put({ type: 'fetch', payload: pl });
            }
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
                if (StaticInfo.userId > 0 && pathname === '/appletManage/banner/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
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

export default BannerModel;
