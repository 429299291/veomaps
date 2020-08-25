import {
    getListings,
    updateListing,
} from '@/services/listing';
import { message } from 'antd'; 

export default {
    namespace: "listing",

    state: {
        data: []
    },

    effects: {
        *get({ query }, { call, put }) {
            const response = yield call(getListings, query);
            if (response) {
                yield put({
                    type: "save",
                    payload: response
                });
            }
        },
       
        *update({ payload, id, onSuccess }, {call, put }) {
            const response = yield call(updateListing, id, payload);
            if (response) {
                message.success("Successfully updated listing");
                onSuccess && onSuccess();
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