import { routerRedux } from "dva/router";
import { stringify } from "qs";
import { fakeAccountLogin, getFakeCaptcha } from "@/services/api";
import { setAuthority } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import { reloadAuthorized } from "@/utils/Authorized";
import { notification } from "antd";
import { accountLogin } from "../services/user";
import { ACCESS_TOKEN } from "../utils/request";

export default {
  namespace: "login",

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);

      if (response && response.accessToken) {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);

        setAuthority("admin");
        reloadAuthorized();
        yield put(routerRedux.replace("/"));
      } else {
        notification.error({
          message: "Login Failed",
          description: "wrong password or username"
        });
      }
    },

    *updateToken({ payload }, { call, put }) {},

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: "changeLoginStatus",
        payload: {
          status: false,
          currentAuthority: "guest"
        }
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: "/user/login",
          search: stringify({
            redirect: window.location.href
          })
        })
      );
    }
  }
};
