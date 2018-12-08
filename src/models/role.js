import {
  getAdminRoles,
  getRoleDetail,
  createRole,
  removeRole,
  updateRole
} from "@/services/role";
import { message } from "antd";

export default {
  namespace: "roles",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(getAdminRoles, payload);

      if (Array.isArray(response)) {
        response.map(role => (role.key = role.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateRole, id, payload); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *remove({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removeRole, id); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *add({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createRole, payload); // delete

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
      const roleNames = [];

      action.payload.map(role => (roleNames[role.id] = role.name));

      return {
        ...state,
        data: action.payload,
        roleNames: roleNames,
        total: action.payload.length
      };
    }
  }
};
