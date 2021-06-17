import {
  getAdminAreas,
  getAreaDetail,
  createArea,
  removeArea,
  updateArea,
  getAllAreas,
  getAreaFeatures,
  getAreaFeature,
  updateAreaFeature,
  createAreaFeature,
  getAreasAll,
  addArea,//
  updateAreaNew,//
  getHubImageUploadUrl
} from "@/services/area";
import { message } from "antd";

export default {
  namespace: "areas",

  state: {
    total: 0,
    newArea:{},
    data: [],
    selectedAreaId: null,
    areaFeatures: []
  },

  effects: {
    //new api
    *getAreasAll({ payload }, { call, put }) {//get singel area
      console.log(payload);
      const response = yield call(getAreasAll, payload);
      yield put({
        type: "newSave",
        payload: response
      });

    },
    *addArea({ payload }, { call, put }) {
      const response = yield call(addArea, payload);
      yield put({
        type: "get"
      });
      // yield put({
      //   type: "getAreasAll"
      // });
    },
    *updateAreaNew({ payload,areaId }, { call, put }) {
      const response = yield call(updateAreaNew,areaId, payload);
      yield put({
        type: "get"
      });
      yield put({
        type: "getAreasAll",
        payload:{
          areaId
        }
      });
    },
    //////////////
    *get({ payload, onSuccess }, { call, put }) {
      let response = (yield call(getAdminAreas, payload)).content;
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
      // const response = yield call(getAllAreas, payload);
      let response = yield call(getAdminAreas, payload);
      response= response.content
      yield put({
        type: "saveAllAreas",
        payload: Array.isArray(response) ? response : []
      });
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
    },
    
    *getAreaFeature({ areaId, onSuccess }, { call, put, take}) {
      const response = yield call(getAreaFeature, areaId); // get
  
      if (response) {
        onSuccess && onSuccess(response);
      } else {
        message.error(`Get area feature fail: ` + response);
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
    newSave(state,action){
      return {
        ...state,
        newArea:action.payload
      };
    },
    saveAllAreas(state,action){
      return{
        ...state,
        allAreas:action.payload
      }
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
