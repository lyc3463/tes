import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ThingStockInfo from '@/services/thingStockInfo';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import StaffType from '@/ModelTypes/TypeStaff';
import { fixPathname } from '@/utils/common';
let pl={
    page:1,
    warehouseId:0,// 仓库id
    productsName:'',// 物品名称
    startDate:'2000-01-01',// 开始时间
    endDate:'2099-01-01',// 结束日期
    pageSize:50, // 每页数量
    unitId:0// 单位id
}
export interface StaffCountState {
    count: number;
    priceSum: number;
    rentSum: number;
    total: number;
}

export interface StaffInterface {
    namespace: 'ThingStockInfo';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        fenye: Effect;
    };
    reducers: {
        list: Reducer<StaffType[]>;
        one: Reducer<StaffType>;
        count: Reducer<StaffCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ThingStockInfoModel: StaffInterface = {
    namespace: 'ThingStockInfo',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(ThingStockInfo.fetch, payload?payload:pl);
            if (res.ErrorCode == 0) {
                console.log('物品库存列表',res);
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
            return res
        },
        *fetchOne({ type, payload }, { put, call, select }): any {
            const list = yield select((state: any) => state.Staff.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },

        *fenye({ type, payload }, { put, call, select }): any {
            const res = yield call(ThingStockInfo.fenye,payload?payload:pl);
            console.log('分页信息',res);
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

export default ThingStockInfoModel;
