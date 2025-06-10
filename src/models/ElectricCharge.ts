import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ElectricChargeService from '@/services/electricCharge';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TypeElectricCharge from '@/ModelTypes/TypeElectricCharge';
import { fixPathname } from '@/utils/common';
let pl = {
    address:'',
    remark:'',
    name:'',
    startDate:'2025-05-15',
    endDate:'2025-05-16',

};

export interface ElectricChargeCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface HireInterface {
    namespace: 'ElectricCharge';
    state: Object;
    effects: {
        fetch: Effect;
        fenye:Effect;
    };
    reducers: {
        list: Reducer<TypeElectricCharge[]>;
        one: Reducer<TypeElectricCharge>;
        count: Reducer<ElectricChargeCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ElectricChargeModel: HireInterface = {
    namespace: 'ElectricCharge',
    state: {},
    effects: {
        *fetch({ type, payload ,callback }, { put, call, select }): any {
            const res = yield call(ElectricChargeService.fetch,payload?payload: pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
                if (callback) callback(0);
            } else {
                message.error(res.ErrorCode + res.Data);
                if (callback) callback(-1);
            }

        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(ElectricChargeService.fenye,payload?payload: pl);
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
                // if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/electricCharge/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/reportFormsManage/electricCharge/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default ElectricChargeModel;
