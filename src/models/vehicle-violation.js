import {
    getViolations,
    updateViolation,
    countViolations,
    getViolationDatail
} from '@/services/vehicle-violation';
import { message } from 'antd'; 

export default {
    namespace: "vehicleViolations",

    state: {
        data: [],
        total: 0
    },

    effects: {
        *get({ payload }, { call, put }) {
            const response = yield call(getViolations, payload);
            if (response) {
                yield put({
                    type: "save",
                    data: response.content,
                    total:response.totalSize
                });
            }
        },
        *getDetail({ id, onSuccess }, { call, put }) {
            const response = yield call(getViolationDatail, id);
            console.log(response);
            if (response ) {
                onSuccess(response);
            }
        },
        *update({ payload, id, onSuccess }, {call, put }) {
            const response = yield call(updateViolation, id, payload);

            if (response) {
                message.success("Successfully Update the Status of Violation: " + id);
                onSuccess && onSuccess();
            } 
        }

    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.data,
                total: action.total
            };
          }
    }
}