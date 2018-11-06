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

      /*  yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); */
      // Login successfully
      /* if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } */
    },

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
