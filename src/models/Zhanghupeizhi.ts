import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as ZhanghupeizhiService from '@/services/zhanghupeizhi';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import ZhanghupeizhiType from '@/ModelTypes/TypeZhanghupeizhi';
import { fixPathname } from '@/utils/common';
import {add} from "@/services/zhanghupeizhi";
let pl={
    page:1,
    name:'',
    phone:''
}

export interface ZhanghupeizhiCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface ZhanghupeizhiInterface {
    namespace: 'Zhanghupeizhi';
    state: Object;
    effects: {
        edit: Effect;
        one: Effect;
        add: Effect;

    };
    reducers: {
        list: Reducer<ZhanghupeizhiType[]>;
        one: Reducer<ZhanghupeizhiType>;
        count: Reducer<ZhanghupeizhiCountState>;
    };
    subscriptions: { setup: Subscription };
}
const ZhanghupeizhiModel: ZhanghupeizhiInterface = {
    namespace: 'Zhanghupeizhi',
    state: {},
    effects: {
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(ZhanghupeizhiService.edit, payload);
            // yield put({ type: 'one'});
            // yield take('fetch/@@end');
            return result
        },
        *one({ payload, callback }, { call, put, take }): any {
            const result = yield call(ZhanghupeizhiService.one);
            // yield put({ type: 'fetch', payload: pl });  // 重新加载数据
            // yield take('fetch/@@end');
            return result
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(ZhanghupeizhiService.add,payload);
            yield put({ type: 'one' });  // 重新加载数据
            yield take('one/@@end');
            return result
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

export default ZhanghupeizhiModel;
