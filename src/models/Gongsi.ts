import {
  Effect,
  Reducer,
  Subscription,
  history as UmiHistorty,
} from 'umi';
import * as GongsiService from '@/services/gongsi';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import GongsiType from '@/ModelTypes/TypeGongsi';
import { fixPathname } from '@/utils/common';
let pl = {
  page:1,
  cname:'',
  feetype:0
};

export interface GongsiCountState {
  count: number;
  ScoreSum: number;
  pageTotal: number;
}

export interface GongsiInterface {
  namespace: 'Gongsi';
  state: Object;
  effects: {
    fetch: Effect;
    fetchOne: Effect;
    add: Effect;
    edit: Effect;
    remove: Effect;
    shousuo: Effect;
    fenye: Effect;
  };
  reducers: {
    list: Reducer<GongsiType[]>;
    one: Reducer<GongsiType>;
    count: Reducer<GongsiCountState>;
  };
  subscriptions: { setup: Subscription };
}
const GongsiModel: GongsiInterface = {
  namespace: 'Gongsi',
  state: {},
  effects: {
    *fetch({ type, payload }, { put, call, select }): any {
      const res = yield call(GongsiService.fetch, payload?payload:pl);
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
      const list = yield select((state: any) => state.Gongsi.list);
      let one = _.find(list, { Id: payload });
      // const data = yield request(`/api/user/${payload.id}`);
      yield put({
        type: 'one',
        payload: { one },
      });
    },
    *add({ payload, callback }, { call, put, take }): any {
      console.log('添加的参数',payload)
      const result = yield call(GongsiService.add, payload);
      yield put({ type: 'fetch', payload: pl });
      yield take('fetch/@@end');
      return result;
    },
    *edit({ payload, callback }, { call, put, take }): any {
      const result = yield call(GongsiService.edit, payload);
      yield put({ type: 'fetch', payload: pl });
      yield take('fetch/@@end');
      return result;
    },
    *remove({ payload }, { call, put ,take}): any {
      const result = yield call(GongsiService.remove, payload);
      yield put({ type: 'fetch', payload: pl });
      yield take('fetch/@@end');
      return result;
    },
    *shousuo({ type, payload }, { put, call, select }): any {
      const res = yield call(GongsiService.fetch, payload);
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
      const res = yield call(GongsiService.fenye,payload?payload:pl);
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
        if (StaticInfo.userId > 0 && pathname === '/xiangmu/gongsiguanli/') {
          dispatch({
            type: 'fetch',
            payload: location.state,
          });
        }
        if (StaticInfo.userId > 0 && pathname === '/xiangmu/gongsiguanli/') {
          dispatch({
            type: 'fenye',
            payload: location.state,
          });
        }
        // if (StaticInfo.userId > 0 && pathname === '/kehu/byzhuhu/') {
        //   dispatch({
        //     type: 'fetch',
        //     payload: location.state,
        //   });
        // }
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

export default GongsiModel;
