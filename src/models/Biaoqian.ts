import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as BianqianService from '@/services/bianqian';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import BianqianType from '@/ModelTypes/TypeBianqian';
import { fixPathname } from '@/utils/common';
let pl={
    name:''
}

export interface BiaoqianCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface BiaoqianInterface {
    namespace: 'Biaoqian';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<BianqianType[]>;
        one: Reducer<BianqianType>;
        count: Reducer<BiaoqianCountState>;
    };
    subscriptions: { setup: Subscription };
}
const BannerModel: BiaoqianInterface = {
    namespace: 'Biaoqian',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(BianqianService.fetch, pl);
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
            const list = yield select((state: any) => state.Biaoqian.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(BianqianService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(BianqianService.edit, payload);
            yield put({ type: 'fetch', payload: {pl} });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload ,callback}, { call, put }): any {
            const result = yield call(BianqianService.remove, payload);
            if (result.ErrorCode==0){
                yield put({ type: 'fetch', payload: { name:'' } });
                message.success('删除成功')
                return result
            }else {
                yield put({ type: 'fetch', payload: { name:'' } });
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
                if (StaticInfo.userId > 0 && pathname === '/kehu/typeList/') {
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
