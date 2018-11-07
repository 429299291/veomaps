import { queryBikes, queryBike, addFakeList, updateFakeList } from '@/services/bikeList';

export default {
  namespace: 'bike',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBikes, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *add({ payload }, { call, put }) {

      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *remove({ payload }, { call, put }) {

      const response = yield call(callback, payload); // delete
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *update({ payload }, { call, put }) {

      const response = yield call(callback, payload); // delete
      yield put({
        type: 'queryList',
        payload: response,
      });
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    }
  },
};
