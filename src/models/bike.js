import { queryBikes, queryBike, queryBikesCount } from "@/services/bikeList";

export default {
  namespace: "bikes",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBikes, payload);

      if (Array.isArray(response)) {
        response.map(bike => (bike.key = bike.id));
      }

      yield put({
        type: "queryList",
        payload: Array.isArray(response) ? response : []
      });
    },
    *fetchCount({ payload }, { call, put }) {
      const response = yield call(queryBikesCount, payload);

      yield put({
        type: "countList",
        payload: response
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(callback, payload); // post
      yield put({
        type: "queryList",
        payload: response
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(callback, payload); // delete
      yield put({
        type: "queryList",
        payload: response
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(callback, payload); // delete
      yield put({
        type: "queryList",
        payload: response
      });
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    countList(state, action) {
      return {
        ...state,
        total: action.payload
      };
    }
  }
};
