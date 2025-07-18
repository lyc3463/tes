import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as UserPendingService from '@/services/userPending';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import UnitType from '@/ModelTypes/TypeNuit';
import { fixPathname } from '@/utils/common';
let pl = {
    phone:'',
    name:''
};

export interface NuitCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface UnitInterface {
    namespace: 'UserPending';
    state: Object;
    effects: {
        fetch: Effect;
    };
    reducers: {
        list: Reducer<UnitType[]>;
        one: Reducer<UnitType>;
        count: Reducer<NuitCountState>;
    };
    subscriptions: { setup: Subscription };
}
const UserPendingModel: UnitInterface = {
    namespace: 'UserPending',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(UserPendingService.fetch, payload?payload:pl);
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

export default UserPendingModel;
