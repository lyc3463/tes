import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as TurnoverRateServices from '@/services/turnoverRate';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import StaffType from '@/ModelTypes/TypeStaff';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    orderCode:'',
    productsName:'',
    pageSize:50,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
}
export interface StaffCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface StaffInterface {
    namespace: 'TurnoverRate';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<StaffType[]>;
        one: Reducer<StaffType>;
        count: Reducer<StaffCountState>;
    };
    subscriptions: { setup: Subscription };
}
const TurnoverRateModel: StaffInterface = {
    namespace: 'TurnoverRate',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(TurnoverRateServices.fetch, payload?payload:pl);
            console.log('周转情况',res);
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
            const res = yield call(TurnoverRateServices.fenye,payload?payload:pl);
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
            });
        },
    },
};

export default TurnoverRateModel;
