import {Effect, Reducer, Subscription} from 'umi';
import * as RefundService from '@/services/refund';
import {message} from 'antd';
import {fixPathname} from '@/utils/common';

const pl = {
    page: 1,
    phone: '',
    stutes: 0,
    startDate: '2000-01-01',
    endDate: '2099-01-01',
    pageSize: 50,
};

const RefundModel = {
    namespace: 'Refund',
    state: {list: [], count: 0},
    effects: {
        *fetch({payload}, {call, put}) {
            const res = yield call(RefundService.fetch, payload ?? pl);
            if (res.ErrorCode == 0) {
                yield put({type: 'save', payload: {list: res.Data.data, count: res.Data}});
            } else {
                message.error(res.Data);
            }
        },
        *remove({payload}, {call}) {
            const result = yield call(RefundService.refundDelete, payload);
            return result;
        },
    },
    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        },
    },
    subscriptions: {
        setup({dispatch, history}: {dispatch: any; history: any}, done: any) {
            return history.listen(({location}: {location: any}) => {
                const pathname = fixPathname(location.pathname);
            });
        },
    },
};

export default RefundModel;
