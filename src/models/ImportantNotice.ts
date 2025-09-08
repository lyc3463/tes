import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ImportantNoticeService from '@/services/importantNotice';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import HouseType from '@/ModelTypes/TypeCable';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    pageSize:50,
    startDate:'2000-01-01',
    endDate:'2099-12-31',
};

export interface HouseCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface HouseInterface {
    namespace: 'ImportantNotice';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        remove: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<HouseType[]>;
        one: Reducer<HouseType>;
        count: Reducer<HouseCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ImportantNoticeModel: HouseInterface = {
    namespace: 'ImportantNotice',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ImportantNoticeService.fetch, payload?payload:pl);
            console.log('列表',res)
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
            const list = yield select((state: any) => state.House.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(ImportantNoticeService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },

        *remove({ payload }, { call, put,take }): any {
            const result = yield call(ImportantNoticeService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(ImportantNoticeService.fenye, payload?payload:pl);
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
                // if (StaticInfo.userId > 0 && pathname === '/houseManage/editUnit/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/addCable/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/editCable/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/gateManage/addDevice/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
            });
        },
    },
};

export default ImportantNoticeModel;
