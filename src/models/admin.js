import {
  getAdmins,
  getAdminDetail,
  createAdmin,
  removeAdmin,
  updateAdmin,
  updateAdminPassword,
  registerByEmail,
  adminSearch,
  updateMe
} from "@/services/admin";
import { message } from "antd";

export default {
  namespace: "admins",

  state: {
    data: []
  },

  effects: {
    *get({ payload, onSuccess,saveState }, { call, put }) {
      const response = yield call(getAdmins, payload);

      yield put({
        type: "newSave",
        payload: response.content,
        pagenation:{
          page:response.page,
          pageSize:response.pageSize,
          totalPages:response.totalPages,
          totalSize:response.totalSize
        }
      });


      // if (Array.isArray(response)) {
      //   response.map(admin => (admin.key = admin.id));
      // }

     
      // yield put({
      //   type: "save",
      //   payload: Array.isArray(response) ? response : []
      // });

      // if (typeof onSuccess === "function") {
      //   onSuccess();
      // }
    },
    *update({ id, payload, onSuccess, onError,pagination }, { call, put }) {
      payload.roleId = payload.role.id
      const response = yield call(updateAdmin, id, payload); // put
      yield put({
        type: "get",
        payload:{
          pagination
        }
      });
      // if (response) {
      //   message.success(`Add Success, ID : ${response}`);
      //   onSuccess && onSuccess();
      // } else {
      //   message.error(`Add Fail.`);
      //   onError && onError();
      // }
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
    },
    *getadminsdata({ payload, saveState,savepagenations }, { put, call }) {
      const response = yield call(getAdmins, payload);

      yield put({
        type: "newSave",
        payload: response.content,
        pagenation:{
          page:response.page,
          pageSize:response.pageSize,
          totalPages:response.totalPages,
          totalSize:response.totalSize
        }
      });
      saveState ? saveState(response.content) : savepagenations(response.content)
    },
    *adminSearch(
      { id, payload, onSuccess, onError, saveState },
      { call, put }
    ) {
      const response = yield call(adminSearch, payload);
      yield put({
        type: "newSave",
        payload: response.content,
        pagenation:{
          page:response.page,
          pageSize: response.pageSize ? response.pageSize :10,
          totalPages:response.totalPages,
          totalSize:response.totalSize
        }
      });
      // saveState(response.content);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    newSave(state, { payload,pagenation }) {
      return {
        ...state,
        // data: payload,
        data: {payload,pagenation},
      };
    }

  }
};
