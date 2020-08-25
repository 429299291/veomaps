import {
    getOrders,
    updateOrder,
    countOrders
} from '@/services/order';
import { message } from 'antd'; 

export default {
    namespace: "order",

    state: {
        data: [],
        total: 0
    },

    effects: {
        *get({ query }, { call, put }) {
            const response = yield call(getOrders, query);

            const total = yield call(countOrders, query);

            if (response) {
                yield put({
                    type: "save",
                    payload: response,
                    total: total
                });
            }
        },
        
       
        *update({ payload, id, onSuccess }, {call, put }) {
            const response = yield call(updateOrder, id, payload);
            if (response) {
                message.success("Successfully updated order");
                onSuccess && onSuccess();
            }
        }

    },

    reducers: {
        save(state, action) {
            return {
              data: action.payload,
              total: action.total
            };
          }
    }
}