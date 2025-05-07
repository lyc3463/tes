import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as TravelRecordService from '@/services/travelRecord';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import TravelRecordType from '@/ModelTypes/TypeTravelRecord';
import { fixPathname } from '@/utils/common';
import * as TransferenceService from "@/services/transference";
import {shoudongdian} from "@/services/movementCable";
let pl={
    page:1,
    deviceSn:'',
    startDate:'2000-01-01',
    endDate:'2099-01-01',
    pageSize:50
}

export interface PropertiesCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface QuestionnaireInterface {
    namespace: 'TravelRecord';
    state: Object;
    effects: {
        fetch: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<TravelRecordType[]>;
        one: Reducer<TravelRecordType>;
        count: Reducer<PropertiesCountState>;
    };
    subscriptions: { setup: Subscription };
}
const TravelRecordModel: QuestionnaireInterface = {
    namespace: 'TravelRecord',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(TravelRecordService.fetch, payload?payload:pl);

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
            const res = yield call(TravelRecordService.fenye,payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/AccessControlManage/TravelRecord/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/AccessControlManage/TravelRecord/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default TravelRecordModel;
