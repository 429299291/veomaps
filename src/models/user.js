import { query as queryUsers, getMe, updateMe, updatePassword, getNewMe } from "@/services/user";
import UrlToPrivilege from "../pages/Employee/UrlToPrivilege";
import { setAuthority } from "@/utils/authority";
import { reloadAuthorized } from "@/utils/Authorized";
import { routerRedux } from 'dva/router';
import { message } from "antd";

export default {
  namespace: "user",

  state: {
    data:[],
    list: [],
    currentUser: {},
    isUserFetched: false
  },




  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: "save",
        payload: response
      });
    },
    
    *updateRoute(url, { call, put }) {
      window.location.reload();
    },

    *updateMe({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateMe,  payload); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *updatePassword({ newPassword, onSuccess, onError }, { call, put }) {
      const response = yield call(updatePassword,  newPassword); // put

      if (response) {
        message.success(`Change password Success.`);
        onSuccess && onSuccess();
      } else {
        message.error(`Change password Fail.`);
        onError && onError();
      }
    },
    *fetchCurrent({ onSuccess }, { call, put }) {

      yield put({
        type: "clearCurrentUser"
      });


      // const response = yield call(getMe);
      const newReponse = yield call(getNewMe);
      // role set start
      if (newReponse.role) {
      let  permissions = newReponse.role.permissions
        permissions = permissions.map(permission=>{
          return permission.name
        })
        permissions.push('test')
        setAuthority(permissions);
        reloadAuthorized();
      }
      // response.basic.phone = newReponse.phone;
      // response.basic.areaIds = newReponse.areaIds;
      yield put({
        type: "saveCurrentUser",
        payload: newReponse
      });


      if (typeof onSuccess === "function") {
        onSuccess();
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},

        isUserFetched: true
      };
    },
    clearCurrentUser(state) {
      return {
        ...state,
        currentUser: {},
        isUserFetched: false
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload
        }
      };
    }
  }
};
