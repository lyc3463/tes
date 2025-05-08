import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as UnopenedFpListService from '@/services/unopenedFpList';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import UnitType from '@/ModelTypes/TypeNuit';
import { fixPathname } from '@/utils/common';
import {remove} from "@/services/unit";
import {shuidianfetch} from "@/services/unopenedFpList";
let pl = {
    page:1,
    type:0,
    tenantr:0,
    stutes:0,
    pageSize:50
};

export interface NuitCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface UnitInterface {
    namespace: 'UnopenedSdFp';
    state: Object;
    effects: {
        fetch: Effect;
        // fenye: Effect;
    };
    reducers: {
        list: Reducer<UnitType[]>;
        one: Reducer<UnitType>;
        count: Reducer<NuitCountState>;
    };
    subscriptions: { setup: Subscription };
}
const UnopenedSdFpModel: UnitInterface = {
    namespace: 'UnopenedSdFp',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(UnopenedFpListService.shuidianfetch, payload?payload:pl);
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
        // *fenye({ type, payload }, { put, call, select }): any {
        //     const res = yield call(UnopenedFpListService.allfenye, payload?payload:pl);
        //     if (res.ErrorCode == 0) {
        //         yield put({
        //             type: 'count',
        //             payload: { count: res.Data },
        //         });
        //     } else {
        //         message.error(res.ErrorCode + res.Data);
        //     }
        // },
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

export default UnopenedSdFpModel;
