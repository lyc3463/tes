import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as RenovationService from '@/services/renovation';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import RenovationType from '@/ModelTypes/TypeRenovation';
import { fixPathname } from '@/utils/common';


export interface RenovationCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface RenovationInterface {
    namespace: 'Renovation';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<RenovationType[]>;
        one: Reducer<RenovationType>;
        count: Reducer<RenovationCountState>;
    };
    subscriptions: { setup: Subscription };
}
const RenovationModel: RenovationInterface = {
    namespace: 'Renovation',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(RenovationService.fetch, payload?payload:{name:''});
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
            const list = yield select((state: any) => state.Gongsi.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(RenovationService.add, payload);
            yield put({ type: 'fetch', payload: {name:''} });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(RenovationService.edit, payload);
            yield put({ type: 'fetch', payload: {name:''} });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put,take}): any {
            const result = yield call(RenovationService.remove, payload);
            yield put({ type: 'fetch', payload: {name:''} });
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
                if (StaticInfo.userId > 0 && pathname === '/appletManage/region/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/appletManage/addProperties/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/appletManage/editProperties/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/appletManage/propertyDescription/') {
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

export default RenovationModel;
