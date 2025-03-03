import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as JournalingService from '@/services/journaling';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import JournalingType from '@/ModelTypes/TypeJournaling';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    collector_id:'',
    tenantName:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
};
export interface JournalingCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface JournalingInterface {
    namespace: 'Journaling';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
    };
    reducers: {
        list: Reducer<JournalingType[]>;
        one: Reducer<JournalingType>;
        count: Reducer<JournalingCountState>;
    };
    subscriptions: { setup: Subscription };
}
const JournalingModel: JournalingInterface = {
    namespace: 'Journaling',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(JournalingService.fetch,payload?payload: pl);
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
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(JournalingService.fenye,payload?payload: pl);
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

                // if (StaticInfo.userId > 0 && pathname === '/waterCableTrade/waterJournaling/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default JournalingModel;
