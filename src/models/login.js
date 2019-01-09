import { routerRedux } from "dva/router";
import { stringify } from "qs";
import { fakeAccountLogin, getFakeCaptcha } from "@/services/api";
import { setAuthority } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import { reloadAuthorized } from "@/utils/Authorized";
import { notification } from "antd";
import { accountLogin, updateToken } from "../services/user";
import { ACCESS_TOKEN, TOKEN_CREATE_DATE } from "../utils/request";

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
        localStorage.setItem(TOKEN_CREATE_DATE, new Date().getTime().toString());

        setAuthority("basic.admin");
        reloadAuthorized();

        yield put(routerRedux.replace("/"));
      } else {
        notification.error({
          message: "Login Failed",
          description: "wrong password or username"
        });
      }
    },
    *updateToken({ payload }, { call, put }) {

      const millSecondDiff = (new Date().getTime() - parseInt(localStorage.getItem(TOKEN_CREATE_DATE)));

      const daysDiff = Math.floor(millSecondDiff / (1000 * 60 * 60 * 24));

      if (daysDiff < 1)
        return;

      const response = yield call(updateToken, payload);

      if (response && response.accessToken) {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        localStorage.setItem(TOKEN_CREATE_DATE, new Date().getTime().toString());

      } else {
        notification.error({
          message: "Token Refresh Failed"
        });
      }

    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      // yield put({
      //   type: "changeLoginStatus",
      //   payload: {
      //     status: false,
      //     currentAuthority: "guest"
      //   }
      // });

      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_CREATE_DATE);
      localStorage.removeItem("veoride-authority");
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
