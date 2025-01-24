import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as UnitService from '@/services/unit';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import UnitType from '@/ModelTypes/TypeNuit';
import { fixPathname } from '@/utils/common';
import {remove} from "@/services/unit";
let pl = {
    page:1,
    name: '',
    beginRents:0,
    endRents:9999999999,
    status:0,
    house_id:0
};

export interface NuitCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface UnitInterface {
    namespace: 'Unit';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
        fetchFenye: Effect;
    };
    reducers: {
        list: Reducer<UnitType[]>;
        one: Reducer<UnitType>;
        count: Reducer<NuitCountState>;
    };
    subscriptions: { setup: Subscription };
}
const UnitModel: UnitInterface = {
    namespace: 'Unit',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(UnitService.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Unit.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(UnitService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(UnitService.edit, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload }, { call, put ,take}): any {
            const result = yield call(UnitService.remove, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *fetchFenye({ type, payload }, { put, call, select }): any {
            const res = yield call(UnitService.fetchFenye, payload?payload:pl);
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
                if (StaticInfo.userId > 0 && pathname === '/houseManage/houseList/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/houseManage/houseList/') {
                    dispatch({
                        type: 'fetchFenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/houseManage/houseList/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/houseManage/unit/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/waterCableManage/addCable/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/addStaff/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/check/contracteInfo/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/enter/editStaff/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/houseManage/houseHire/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/houseManage/houseHire/') {
                    dispatch({
                        type: 'fenye',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/kehu/byzhuhu/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                if (StaticInfo.userId > 0 && pathname === '/kehu/editByzhuhu/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
            });
        },
    },
};

export default UnitModel;
