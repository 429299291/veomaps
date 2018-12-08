import { updateRolePrivileges, getPrivieges } from "@/services/privilege";
import { message } from "antd";

export default {
  namespace: "privileges",

  state: {
    data: []
  },

  effects: {
    *updateRolePrivileges(
      { roleId, privilegeIds, onSuccess, onError },
      { call, put }
    ) {
      const response = yield call(updateRolePrivileges, roleId, privilegeIds); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getPrivieges, payload);

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });
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
