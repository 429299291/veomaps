import {
    getNotification,
    addNotification,
    updateNotification
  } from "@/services/notification";
  import { message } from "antd";
  
  export default {
    namespace: "notification",
    state: {
      data: []
    },
  
    effects: {
        *get({ payload, onSuccess }, { call, put }) {
            const response = yield call(getNotification, payload);
            onSuccess && onSuccess(response.content,response.page,response.pageSize,response.totalSize)
          },
        *add({ payload, onSuccess }, { call, put }) {
          console.log('00000');
        const response = yield call(addNotification, payload);
        onSuccess && onSuccess()
        },
        *update({ id, payload, onSuccess, onError }, { call, put }) {
        const response = yield call(updateNotification, payload); // put
        if (response) {
          onSuccess && onSuccess();
        } else {
          message.error(`update Fail.`);
          onError && onError();
        }
      },
    },
  
    reducers: {
      save(state, action) {
        return {
          ...state,
          data: action.payload
        };
      }
    }
  };
  