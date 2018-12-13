import {
  getAdminErrors,
  getErrorDetail,
  batchPassErrors,
  removeError,
  updateError,
  getImages
} from "@/services/error";
import { message } from "antd";

export default {
  namespace: "errors",

  state: {
    data: []
  },

  effects: {
    *getImagePath({ errorId, onSuccess }, { call, put }) {
      const response = yield call(getImages, errorId);

      if (response) {
        onSuccess && onSuccess(response);
      } else {
        message.error(response);
      }
    },
    *get({ payload, onSuccess }, { call, put }) {
      const response = yield call(getAdminErrors, payload);

      if (Array.isArray(response)) {
        response.map(error => (error.key = error.id));
      }


      if (response) {
        onSuccess && onSuccess();
      } else {
        onError && onError();
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateError, id, payload); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *remove({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removeError, id); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *batchPass({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(batchPassErrors, payload); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    }
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
