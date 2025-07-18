import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as NotificationListService from '@/services/notificationList';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import NoticeType from '@/ModelTypes/TypeNotice';
import { fixPathname } from '@/utils/common';

export interface NoticeCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface NoticeInterface {
    namespace: 'NotificationList';
    state: Object;
    effects: {
        fetch: Effect;
    };
    reducers: {
        list: Reducer<NoticeType[]>;
        one: Reducer<NoticeType>;
        count: Reducer<NoticeCountState>;
    };
    subscriptions: { setup: Subscription };
}
const NotificationListModel: NoticeInterface = {
    namespace: 'NotificationList',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(NotificationListService.fetch);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res;
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
            });
        },
    },
};

export default NotificationListModel;
