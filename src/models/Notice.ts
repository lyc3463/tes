import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as NoticeService from '@/services/notice';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import NoticeType from '@/ModelTypes/TypeNotice';
import { fixPathname } from '@/utils/common';

let pl = {
    allNoticeName:'',
    beginTimeNotice:'2000-01-01',
    endTimeNotice:'2099-01-01'
};
export interface NoticeCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface NoticeInterface {
    namespace: 'Notice';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<NoticeType[]>;
        one: Reducer<NoticeType>;
        count: Reducer<NoticeCountState>;
    };
    subscriptions: { setup: Subscription };
}
const NoticeModel: NoticeInterface = {
    namespace: 'Notice',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(NoticeService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Notice.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(NoticeService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(NoticeService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put ,take}): any {
            const result = yield call(NoticeService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
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
                if (StaticInfo.userId > 0 && pathname === '/propertyServerManage/notice/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default NoticeModel;
