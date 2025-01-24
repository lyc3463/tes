import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CableJournalingService from '@/services/cableJournaling';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import CableJournalingType from '@/ModelTypes/TypeCableJournaling';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    collector_id:'',
    tenantName:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
};
export interface CableJournalingCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface CableJournalingInterface {
    namespace: 'CableJournaling';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
    };
    reducers: {
        list: Reducer<CableJournalingType[]>;
        one: Reducer<CableJournalingType>;
        count: Reducer<CableJournalingCountState>;
    };
    subscriptions: { setup: Subscription };
}
const CableJournalingModel: CableJournalingInterface = {
    namespace: 'CableJournaling',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CableJournalingService.fetch,payload?payload: pl);
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
            const res = yield call(CableJournalingService.fenye,payload?payload: pl);
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

                if (StaticInfo.userId > 0 && pathname === '/waterCableTrade/cableJournaling/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default CableJournalingModel;
