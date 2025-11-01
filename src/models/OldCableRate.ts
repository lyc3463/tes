import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CableRateService from '@/services/cableRate';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import CableRateType from '@/ModelTypes/TypeCableRate';
import { fixPathname } from '@/utils/common';
import {oldFenye, oldFetch} from "@/services/cableRate";
let pl={
    page:1,
    cid:'',
    name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    tenantId:0,
    recordStatus:'扣费成功',
    remark:'',
    pageSize:10
}

export interface CableRateCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface CableRateInterface {
    namespace: 'OldCableRate';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;

    };
    reducers: {
        list: Reducer<CableRateType[]>;
        one: Reducer<CableRateType>;
        count: Reducer<CableRateCountState>;
    };
    subscriptions: { setup: Subscription };
}
const OldCableRateModels: CableRateInterface = {
    namespace: 'OldCableRate',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CableRateService.oldFetch,payload?payload:pl);
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
            const res = yield call(CableRateService.oldFenye,payload?payload:pl);
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

                // if (StaticInfo.userId > 0 && pathname === '/financeSum/CableRate/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/financeSum/CableRate/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default OldCableRateModels;
