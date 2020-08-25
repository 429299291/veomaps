import {
  getAdminAreas,
  getAreaDetail,
  createArea,
  removeArea,
  updateArea,
  getAllAreas,
  getAreaFeatures,
  updateAreaFeature,
  createAreaFeature,
  getHubImageUploadUrl
} from "@/services/area";
import { message } from "antd";

export default {
  namespace: "areas",

  state: {
    total: 0,
    data: [],
    selectedAreaId: null,
    areaFeatures: []
  },

  effects: {
    *get({ payload, onSuccess }, { call, put }) {
      const response = yield call(getAdminAreas, payload);

      if (Array.isArray(response)) {
        response.map(area => (area.key = area.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });

      if (typeof onSuccess == "function") {
        onSuccess(response);
      }

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
    *getHubUploadUrl({ hubId, onSuccess }, { call, put }) {

      const response = yield call(getHubImageUploadUrl, hubId);

      if (typeof onSuccess == "function") {
        onSuccess(response);
      }

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
    },
    *addAreaFeature({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createAreaFeature, payload); // post
  
      if (response) {
        message.success(`Create Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Create Fail.`);
        onError && onError();
      }
    },
    *getAreaFeaturesEffect({ payload}, { call, put, take}) {
      const response = yield call(getAreaFeatures); // get
  
      const isArray = Array.isArray(response);
  
      yield put({
        type: "saveAreaFeatures",
        payload: isArray ? response : []
      });
    },
  
    *updateAreaFeature({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateAreaFeature, id, payload); // put
  
      if (response) {
        message.success(`Update Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Update Fail.`);
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
    },
    saveAreaFeatures(state, action) {


      const areas = state.data;

      const areaFeatures = {};

      action.payload.map(areaFeature => areaFeatures[areaFeature.areaId] = areaFeature)
      



     const result = areas.map(area => {
        if (areaFeatures[area.id]) {
          area.areaFeature = areaFeatures[area.id];
        }


        return area;
        
      })



      return {
        ...state,
        data: result,
      };
    }
  }
};
