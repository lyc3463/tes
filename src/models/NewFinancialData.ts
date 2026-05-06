import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as NewFinancialDataService from '@/services/newFinancialData';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import LinksType from '@/ModelTypes/TypeLinks';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    orderCode:'',
    company_name:'',
    account_card:'',
    project_name:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50,
    orderStatus:0,
    moneyType:0,
    supplierId:0,
    foType:2,
    paidStatus:0,
    expenseCode:'',
    userId:0
}

export interface LinksCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface LinksInterface {
    namespace: 'NewFinancialData';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fenye: Effect;
        check: Effect;
        allReview: Effect;
    };
    reducers: {
        list: Reducer<LinksType[]>;
        one: Reducer<LinksType>;
        count: Reducer<LinksCountState>;
    };
    subscriptions: { setup: Subscription };
}
const NewFinancialDataModel: LinksInterface = {
    namespace: 'NewFinancialData',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(NewFinancialDataService.fetch, payload?payload:pl);
            console.log('列表',res)
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res;
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Links.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload }, { call, put,take }): any {
            const result = yield call(NewFinancialDataService.add, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
        *allReview({ payload }, { call, put,take }): any {
            const result = yield call(NewFinancialDataService.allReview, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(NewFinancialDataService.edit, payload);
            yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            yield take('fetch/@@end');
            return result

        },
        *remove({ payload }, { call, put,take }): any {
            const result = yield call(NewFinancialDataService.remove, payload);
            // yield put({ type: 'fetch', payload: pl });
            // yield take('fetch/@@end');
            return result
        },
        *check({ payload }, { call, put,take }): any {
            const result = yield call(NewFinancialDataService.check, payload);
            yield put({ type: 'fetch', payload: pl});
            yield take('fetch/@@end');
            return result
        },
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(NewFinancialDataService.fenye,payload?payload:pl);
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

export default NewFinancialDataModel;
