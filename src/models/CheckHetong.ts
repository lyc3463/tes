import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CheckHetongService from '@/services/checkHetong';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import CheckHetongType from '@/ModelTypes/TypeCheckHetong';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    identifier:'',
    contractType:0,
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    name:'',
    pageSize:50
}

export interface CheckHetongCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface CheckHetongInterface {
    namespace: 'CheckHetong';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<CheckHetongType[]>;
        one: Reducer<CheckHetongType>;
        count: Reducer<CheckHetongCountState>;
    };
    subscriptions: { setup: Subscription };
}
const CheckHetongModels: CheckHetongInterface = {
    namespace: 'CheckHetong',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CheckHetongService.fetch, payload?payload:pl);
            // const resc = yield call(
            //   GongsiService.fetchcount,
            //   _.omit(pl, ['page']),
            // );
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
        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(CheckHetongService.fenye, payload?payload:pl);

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
                if (StaticInfo.userId > 0 && pathname === '/contract/contractList/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                // if (StaticInfo.userId > 0 && pathname === '/enter/afterSales/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                if (StaticInfo.userId > 0 && pathname === '/contract/contractList/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                // if (StaticInfo.userId > 0 && pathname === '/enter/addRename/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                //
                // if (StaticInfo.userId > 0 && pathname === '/enter/addTransference/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/enter/editRename/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/enter/addRenew/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/enter/addOutRent/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/enter/addPreferential/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/enter/AddByStages/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
            });
        },
    },
};

export default CheckHetongModels;
