import { queryNotices } from "@/services/api";
import { getNotice } from "../../mock/api";

export default {
  namespace: "global",

  state: {
    collapsed: false,
    notices: [],
    isMobile: window.innerWidth <= 600
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      //const data = yield call(queryNotices);

      const data = getNotice();

      yield put({
        type: "saveNotices",
        payload: data
      });
      yield put({
        type: "user/changeNotifyCount",
        payload: data.length
      });
    },
    *isMobile({ value }, { call, put }) {
      //const data = yield call(queryNotices);

      yield put({
        type: "setIsMobile",
        value: value
      });
      
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: "saveClearedNotices",
        payload
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: "user/changeNotifyCount",
        payload: count
      });
    }
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload
      };
    },
    setIsMobile(state, { value }) {
      return {
        ...state,
        isMobile: value
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload)
      };
    }
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== "undefined") {
          window.ga("send", "pageview", pathname + search);
        }
      });
    }
  }
};
