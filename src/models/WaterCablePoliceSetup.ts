import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as WaterCablePoliceSetupService from '@/services/waterCablePoliceSetup';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import WaterCableType from '@/ModelTypes/TypeWaterCable';
import { fixPathname } from '@/utils/common';


export interface WaterCableState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface WaterCableInterface {
    namespace: 'WaterCablePoliceSetup';
    state: Object;
    effects: {
        fetch: Effect;
    };
    reducers: {
        list: Reducer<WaterCableType[]>;
        one: Reducer<WaterCableType>;
        count: Reducer<WaterCableState>;
    };
    subscriptions: { setup: Subscription };
}
const WaterCablePoliceSetupModel: WaterCableInterface = {
    namespace: 'WaterCablePoliceSetup',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(WaterCablePoliceSetupService.fetch);
            console.log('res',res)
            if (res.ErrorCode == 0) {
                const filterList = res.Data.filter(item => item.parkId === StaticInfo.park_id);
                yield put({
                    type: 'list',
                    payload: { list: filterList},
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

export default WaterCablePoliceSetupModel;
