import {
  getFencesByAreaId,
  createFence,
  updateFence,
  deleteFence,
  getAreaCenter,
  createAreaCenter,
  updateAreaCenter,
  deleteAreaCenter
} from "@/services/geo";
import { message } from "antd";

export default {
  namespace: "geo",

  state: {
    fences: [],
    center: null
  },

  effects: {
    *getFences({ areaId }, { call, put }) {
      const response = yield call(getFencesByAreaId, areaId);

      if (Array.isArray(response)) {
        response.map(area => (area.key = area.id));
      }

      yield put({
        type: "saveFence",
        payload: Array.isArray(response) ? response : []
      });
    },
    *addFence({ payload }, { call, put }) {
      const response = yield call(createFence, payload); // post

      if (response) {
        message.success(`Add Success, ID : ${response}`);
      } else {
        message.error(`Add Fail.`);
      }
    },
    *removeFence({ id }, { call, put }) {
      const response = yield call(deleteFence, id); // post
    },
    *updateFence({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateFence, id, payload); // put

      response ? onSuccess(response) : onError();

      if (response) {
        message.success(`Update Success!`);
        onSuccess();
      } else {
        message.error(`Update Fail.`);
      }
    },
    *getCenter({ areaId }, { call, put }) {
      const response = yield call(getAreaCenter, areaId);

      if (Array.isArray(response)) {
        response.map(area => (area.key = area.id));
      }

      yield put({
        type: "saveCenter",
        payload: Array.isArray(response) ? response : []
      });
    },
    *addCenter({ payload }, { call, put }) {
      const response = yield call(createAreaCenter, payload); // post

      if (response) {
        message.success(`Add Success, ID : ${response}`);
      } else {
        message.error(`Add Fail.`);
      }
    },
    *removeCenter({ id }, { call, put }) {
      const response = yield call(deleteAreaCenter, id); // post
    },
    *updateCenter({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateAreaCenter, id, payload); // put

      response ? onSuccess(response) : onError();

      if (response) {
        message.success(`Update Success!`);
        onSuccess();
      } else {
        message.error(`Update Fail.`);
      }
    }
  },

  reducers: {
    saveFence(state, action) {
      return {
        ...state,
        fences: action.payload
      };
    },
    saveCenter(state, action) {
      return {
        ...state,
        center: action.payload
      };
    }
  }
};
