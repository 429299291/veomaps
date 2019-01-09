import {
  getAdmins,
  getAdminDetail,
  createAdmin,
  removeAdmin,
  updateAdmin,
  updateAdminPassword
} from "@/services/admin";
import { message } from "antd";

export default {
  namespace: "admins",

  state: {
    data: []
  },

  effects: {
    *get({ payload, onSuccess }, { call, put }) {
      const response = yield call(getAdmins, payload);

      if (Array.isArray(response)) {
        response.map(admin => (admin.key = admin.id));
      }

      if (typeof onSuccess === "function") {
        onSuccess(response);
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateAdmin, id, payload); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *updatePassword({ id, newPassword, onSuccess, onError }, { call, put }) {
      const response = yield call(updateAdminPassword, id, newPassword); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *remove({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removeAdmin, id); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *add({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createAdmin, payload); // delete

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