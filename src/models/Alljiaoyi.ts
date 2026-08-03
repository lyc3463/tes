import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as RechargeRateService from '@/services/alljiaoyi';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import RechargeRateType from '@/ModelTypes/TypeRechargeRate';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    name:'',
    phone:'',
    type:1,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    userID:0,
    pageSize:50
}

export interface PropertiesCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface QuestionnaireInterface {
    namespace: 'Alljiaoyi';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<RechargeRateType[]>;
        one: Reducer<RechargeRateType>;
        count: Reducer<PropertiesCountState>;
    };
    subscriptions: { setup: Subscription };
}
const AlljiaoyiModel: QuestionnaireInterface = {
    namespace: 'Alljiaoyi',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(RechargeRateService.fetch, payload?payload:pl);
            console.log('res',res)
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data.data },
                });
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res;
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(RechargeRateService.fenye,payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
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

export default AlljiaoyiModel;
