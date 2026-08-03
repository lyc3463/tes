import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CollectorService from '@/services/collector';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import CollectorType from '@/ModelTypes/TypeCollector';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    collector_number:'',
    stutes:2,
    pageSize:50
}

export interface CollectorCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface CollectorInterface {
    namespace: 'CollectorStutes';
    state: Object;
    effects: {
        fetch: Effect;

    };
    reducers: {
        list: Reducer<CollectorType[]>;
        one: Reducer<CollectorType>;
        count: Reducer<CollectorCountState>;
    };
    subscriptions: { setup: Subscription };
}
const CollectorStutesModels: CollectorInterface = {
    namespace: 'CollectorStutes',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CollectorService.CollectorStutes, payload?payload:pl);
            console.log('props',res)
            if (res.ErrorCode == 0) {
                const filterList = res.Data.filter(item => item.parkId === StaticInfo.park_id);
                yield put({
                    type: 'list',
                    payload: { list: filterList},
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res
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
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/collector/') {
                //         dispatch({
                //             type: 'fetch',
                //             payload: location.state,
                //         });
                //     }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/addCable/') {
                //         dispatch({
                //             type: 'fetch',
                //             payload: location.state,
                //         });
                //     }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/editCable/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/addWater/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/editWater/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
                // if (StaticInfo.userId > 0 && pathname === '/waterCableManage/collector/') {
                //     dispatch({
                //         type: 'fenye',
                //         payload: location.state,
                //     });
                // }

            });
        },
    },
};

export default CollectorStutesModels;
