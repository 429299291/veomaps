import {
    getMessage,
    getMessages,
    createMessage,
    updateMessage,
    getCustomerApprovedViolationCount
} from '@/services/violation';
import { message } from 'antd'; 

export default {
    namespace: "violation",

    state: {
        data: []
    },

    effects: {
        *get({ payload }, { call, put }) {
            if(!payload.areaId){return false}
            const response = yield call(getMessages, payload);
            if (response) {
                yield put({
                    type: "save",
                    payload: response
                });
            }
        },
        *getMessage( { payload, onSuccess }, { call, put }) {
            const response = yield call(getMessage, payload);
            if (response) {
                onSuccess(response);
            }
        },
        *update({ payload, id, onSuccess }, {call, put }) {
            const response = yield call(updateMessage, id, payload);
            if (response) {
                message.success("Successfully updated message");
                onSuccess && onSuccess();
            }
        },
        *add({ payload, onSuccess }, { call, put}) {
            const response = yield call(createMessage, payload);
            if (response) {
                message.success("Successfully added message");
                onSuccess && onSuccess();
            } else {
                message.error("Failure adding message");
            }
        },


        *getCustomerApprovedViolationCount({customerId, onSuccess}, {call, put}) {

            const response = yield call(getCustomerApprovedViolationCount, customerId);
            
            if (Number.isInteger(response)) {
                onSuccess(response);
            }

        }

    },

    reducers: {
        save(state, action) {
            return {
              data: action.payload,
            };
          }
    }
}