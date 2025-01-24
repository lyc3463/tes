import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as HireService from '@/services/hire';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TypeHire from '@/ModelTypes/TypeHire';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    name:'',
    phone:'',
    beginRents:0,
    endRents:99999999,
    stutes:0,
    house_id:0
};

export interface HireCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface HireInterface {
    namespace: 'Hire';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
    };
    reducers: {
        list: Reducer<TypeHire[]>;
        one: Reducer<TypeHire>;
        count: Reducer<HireCountState>;
    };
    subscriptions: { setup: Subscription };
}
const HireModel: HireInterface = {
    namespace: 'Hire',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(HireService.fetch,payload?payload: pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(HireService.fenye,payload?payload: pl);
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
                if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/hire/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/hire/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default HireModel;
