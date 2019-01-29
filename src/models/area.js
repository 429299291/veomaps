import {
  getAdminAreas,
  getAreaDetail,
  createArea,
  removeArea,
  updateArea,
  getAllAreas
} from "@/services/area";
import { message } from "antd";

export default {
  namespace: "areas",

  state: {
    total: 0,
    data: [],
    selectedAreaId: null
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
    *getAll({ payload, onSuccess }, { call, put }) {
      const response = yield call(getAllAreas, payload);


      if (typeof onSuccess == "function") {
        onSuccess(response);
      }
    },
    *selectArea({ areaId }, { call, put }) {

      yield put({
        type: "saveSelectArea",
        payload: areaId
      });
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateArea, id, payload); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *remove({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removeArea, id); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *add({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createArea, payload); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    }
  },

  reducers: {
    save(state, action) {
      const areaNames = [];

      action.payload.map(area => (areaNames[area.id] = area.name));

      return {
        ...state,
        data: action.payload,
        areaNames: areaNames,
        total: action.payload.length
      };
    },
    saveSelectArea(state, action) {

      return {
        ...state,
        selectedAreaId: action.payload,
      };
    }
  }
};
