import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as GroupingService from '@/services/grouping';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import GroupingType from '@/ModelTypes/TypeGrouping';
import { fixPathname } from '@/utils/common';
let pl = {
    page:1,
    cname:'',
    feetype:0
};

export interface GroupingCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface GroupingInterface {
    namespace: 'Grouping';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        shousuo: Effect;
    };
    reducers: {
        list: Reducer<GroupingType[]>;
        one: Reducer<GroupingType>;
        count: Reducer<GroupingCountState>;
    };
    subscriptions: { setup: Subscription };
}
const GroupingModel: GroupingInterface = {
    namespace: 'Grouping',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(GroupingService.fetch, pl);
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
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Grouping.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(GroupingService.add, payload);
            yield put({ type: 'fetch', payload: {} });
            yield take('fetch/@@end');
            return result;
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(GroupingService.edit, payload);
            yield put({ type: 'fetch', payload: {pl} });
            yield take('fetch/@@end');
            return result;
        },
        *remove({ payload }, { call, put }): any {
            const result = yield call(GroupingService.remove, payload);
            if (result.status !== 'ok') {
                alert('cuowu');
            }
            yield put({ type: 'fetch', payload: { page: 1 } });
            UmiHistorty.replace({
                pathname: '../user/list',
            });
        },
        *shousuo({ type, payload }, { put, call, select }): any {
            const res = yield call(GroupingService.fetch, payload);
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
                // if (StaticInfo.userId > 0 && pathname === '/gateManage/grouping/') {
                //     dispatch({
                //         type: 'fetch',
                //         payload: location.state,
                //     });
                // }
            });
        },
    },
};

export default GroupingModel;
