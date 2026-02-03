import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as NewBillSumService from '@/services/newBillSum';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import NoticeType from '@/ModelTypes/TypeNotice';
import { fixPathname } from '@/utils/common';

let pl = {
    page:1,
    numBerOrder:'',
    company_name:'',
    account_card:'',
    project_name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    moneyType:0,
    pageSize:50,
};
export interface NoticeCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface NoticeInterface {
    namespace: 'NewBillSum';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;

    };
    reducers: {
        list: Reducer<NoticeType[]>;
        one: Reducer<NoticeType>;
        count: Reducer<NoticeCountState>;
    };
    subscriptions: { setup: Subscription };
}
const NewBillSumModel: NoticeInterface = {
    namespace: 'NewBillSum',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(NewBillSumService.fetch, payload?payload:pl);
            console.log('res',res)
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
            const res = yield call(NewBillSumService.fenye,payload?payload:pl);
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

export default NewBillSumModel;
