import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as BillService from '@/services/billSum';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import BillSumType from '@/ModelTypes/TypeBillSum';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    billAbstract:'',
    billBgeinTime:'2000-01-01',
    billEndTime:'2099-01-01',
    billStatus:1,
    billMoneyType:2,
    companyId:0,
    projectId:0,
    subjectId:0,
    account_card:'',
    pageSize:50
}

export interface BillSumCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface BillSumInterface {
    namespace: 'BillSum';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<BillSumType[]>;
        one: Reducer<BillSumType>;
        count: Reducer<BillSumCountState>;
    };
    subscriptions: { setup: Subscription };
}
const BannerModel: BillSumInterface = {
    namespace: 'BillSum',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(BillService.fetch, payload?payload:pl);
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
            const res = yield call(BillService.fenye, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'count',
                    payload: { count: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.BillSum.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
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
                if (StaticInfo.userId > 0 && pathname === '/financeManage/billSum/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/financeManage/billSum/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default BannerModel;
