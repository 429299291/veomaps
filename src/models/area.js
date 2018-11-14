import {
  getAdminAreas,
  getAreaDetail,
  createArea,
  removeArea,
  updateArea
} from "@/services/area";

export default {
  namespace: "areas",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(getAdminAreas, payload);

      if (Array.isArray(response)) {
        response.map(area => (area.key = area.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });
    },
    *update({ id, payload }, { call, put }) {
      const response = yield call(updateArea, id, payload); // put

      const data = yield call(getAdminAreas, payload);

      if (Array.isArray(data)) {
        response.map(area => (area.key = area.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(data) ? data : []
      });
    },
    *remove({ id, payload }, { call, put }) {
      const response = yield call(removeArea, id); // delete

      const data = yield call(getAdminAreas, payload);

      if (Array.isArray(data)) {
        response.map(area => (area.key = area.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(data) ? data : []
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(createArea, payload); // delete

      const data = yield call(getAdminAreas, payload);

      if (Array.isArray(data)) {
        response.map(area => (area.key = area.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(data) ? data : []
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        total: action.payload.length
      };
    }
  }
};
