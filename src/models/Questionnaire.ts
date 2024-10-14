import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as QuestionnaireService from '@/services/questionnaire';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import QuestionnaireType from '@/ModelTypes/TypeQuestionnaire';
import { fixPathname } from '@/utils/common';
import * as BannerService from "@/services/banner";
let pl={
    name:''
}

export interface PropertiesCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface QuestionnaireInterface {
    namespace: 'Questionnaire';
    state: Object;
    effects: {
        fetch: Effect;
        fetchOne: Effect;
        add: Effect;
        edit: Effect;
        remove: Effect;
    };
    reducers: {
        list: Reducer<QuestionnaireType[]>;
        one: Reducer<QuestionnaireType>;
        count: Reducer<PropertiesCountState>;
    };
    subscriptions: { setup: Subscription };
}
const QuestionnaireModel: QuestionnaireInterface = {
    namespace: 'Questionnaire',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(QuestionnaireService.fetch, payload?payload:pl);
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
            const list = yield select((state: any) => state.Questionnaire.list);
            let one = _.find(list, { Id: payload });
            // const data = yield request(`/api/user/${payload.id}`);
            yield put({
                type: 'one',
                payload: { one },
            });
        },
        *add({ payload, callback }, { call, put, take }): any {
            const result = yield call(QuestionnaireService.add, payload);
            yield put({ type: 'fetch', payload: pl });
            yield take('fetch/@@end');
            return result
        },
        *edit({ payload, callback }, { call, put, take }): any {
            const result = yield call(QuestionnaireService.edit, payload);
            yield put({ type: 'fetch', payload: {pl} });
            yield take('fetch/@@end');
            return result
        },
        *remove({ payload ,callback}, { call, put }): any {
            const result = yield call(QuestionnaireService.remove, payload);
            if (result.ErrorCode==0){
                yield put({ type: 'fetch', payload: { name:'' } });
                message.success('删除成功')
                return result
            }else {
                yield put({ type: 'fetch', payload: { name:'' } });
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

                // 楼盘列表
                if (StaticInfo.userId > 0 && pathname === '/appletManage/properties/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }

                // 添加房源获取楼盘列表
                if (StaticInfo.userId > 0 && pathname === '/appletManage/addResources/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }
                // 修改房源获取楼盘列表
                if (StaticInfo.userId > 0 && pathname === '/appletManage/editResources/') {
                    dispatch({
                        type: 'fetch',
                        payload: location.state,
                    });
                }

            });
        },
    },
};

export default QuestionnaireModel;
