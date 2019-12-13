import {
  getAdmins,
  getAdminDetail,
  createAdmin,
  removeAdmin,
  updateAdmin,
  updateAdminPassword,
  registerByEmail,
  updateMe
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

     
      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });

      if (typeof onSuccess === "function") {
        onSuccess();
      }
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

    *emailRegister({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(registerByEmail, payload); // delete

      if (response) {
        message.success(`Register Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Register Fail.`);
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
