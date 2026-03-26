import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as OldBillSumService from '@/services/oldBillSum';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import OldBillSumType from '@/ModelTypes/TypeOldBillSum';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    orderNumber:'',
    accountName:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50,
    createName:'',
};
export interface NoticeCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface NoticeInterface {
    namespace: 'OldBillSum';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;

    };
    reducers: {
        list: Reducer<OldBillSumType[]>;
        one: Reducer<OldBillSumType>;
        count: Reducer<NoticeCountState>;
    };
    subscriptions: { setup: Subscription };
}
const OldBillSumModel: NoticeInterface = {
    namespace: 'OldBillSum',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(OldBillSumService.fetch, payload?payload:pl);
            console.log('res',res);
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
            const res = yield call(OldBillSumService.fenye,payload?payload:pl);
            console.log(res)
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

export default OldBillSumModel;
