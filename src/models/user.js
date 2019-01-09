import { query as queryUsers, getMe } from "@/services/user";
import UrlToPrivilege from "../pages/Employee/UrlToPrivilege";
import { setAuthority } from "@/utils/authority";
import { reloadAuthorized } from "@/utils/Authorized";
import * as routerRedux from "react-router-redux";

export default {
  namespace: "user",

  state: {
    list: [],
    currentUser: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: "save",
        payload: response
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(getMe);

      const flatUrlToPrivileges = Object.keys(UrlToPrivilege)
        .map(key => UrlToPrivilege[key])
        .reduce((result, group) => Object.assign({}, result, group), {});

      if (response.privileges) {
        const permissions = response.privileges.reduce((result, privilege) => {
          const permission =
            flatUrlToPrivileges[`${privilege.method} ${privilege.url}`];
          if (permission) {
            result.push(permission);
          }

          return result;
        }, []);

        permissions.push("basic.admin");

        setAuthority(permissions);
        reloadAuthorized();
      }

      yield put({
        type: "saveCurrentUser",
        payload: response
      });
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
        currentUser: action.payload || {}
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
