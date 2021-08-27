import {
  getFencesByAreaId,
  createFence,
  updateFence,
  deleteFence,
  getAreaCenterByAreaId,
  createAreaCenter,
  updateAreaCenter,
  deleteAreaCenter,
  examineParking,
  createPrimeLocation,
  getPrimeLocationByAreaId,
  deletePrimeLocation,
  updateHub,
  handleCheckPrimeLocation,
  getGeoObject
} from "@/services/geo";

import {parkingViolationType} from "@/constant";

import { message } from "antd";

export default {
  namespace: "geo",

  state: {
    fences: [],
    primeLocations: [],
    area: null
  },

  effects: {
    *examineParkingTest({areaId, imei, location}, {call, put}) {
      
      const response = yield call(examineParking, areaId, imei, location.lat, location.lng);  

      message.success(`Parking Violation: ${parkingViolationType[response]}`);

    },

    *addPrimeLocation({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createPrimeLocation, payload); // post


      if (response) {
        message.success(`Create Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Create Fail.`);
        onError && onError();
      }
    },
    *checkPrimeLocation({ payload, areaId, }, { call, put }) {
      const response = yield call(handleCheckPrimeLocation, areaId, payload); // get


      if (response) {
        message.success(`Create Success, ID : ${response}`);
      } else {
        message.error(`Create Fail.`);
      }
    },
    *updatePrimeLocation({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateHub, payload); // put


      if (response) {
        message.success(`Update Success, ID : ${payload.id}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Update Fail.`);
        onError && onError();
      }
    },
    *getPrimeLocations({ areaId, onSuccess }, { call, put }) {


      const response = yield call(getPrimeLocationByAreaId, areaId); // get

      const isArray = Array.isArray(response);

      yield put({
        type: "savePrimeLocations",
        payload: isArray ? response : []
      });

      onSuccess && onSuccess(isArray ? response : []);
    },

    *removePrimeLocation({ id, onSuccess, onError }, { call, put }) {
      const response = yield call(deletePrimeLocation, id); // delete
      if (response) {
        message.success(`Delete Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Delete Fail!`);
        onError && onError();
      }
    },

    *getFences({ areaId, onSuccess }, { call, put }) {
      const response = yield call(getFencesByAreaId, areaId);

      const isArray = Array.isArray(response);

      if (isArray) {
        //sort fences by fencetype so geo fence always be the first one to render so other fences in geofence will have higher priority of click event.
        //geoFence 0 and subGeoFence 5 should always has priority, so the response should be organized into form like [0,5,...]
        response.sort((a, b) => {

          a = a.fenceType;
          b = b.fenceType;

          const aP =  a === 5 ? 1 : a === 1  ? 5 : a;
          const bP =  b === 5 ? 1 : b === 1  ? 5 : b;
          return aP - bP;
        });
      }

      

      yield put({
        type: "saveFence",
        payload: isArray ? response : []
      });

      yield put({type: "getPrimeLocations", areaId: areaId, onSuccess});


    },
    *addFence({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createFence, payload); // post

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    
    *removeFence({ id, onSuccess, onError }, { call, put }) {
      const response = yield call(deleteFence, id); // delete
      if (response) {
        message.success(`Delete Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Delete Fail!`);
        onError && onError();
      }
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
      let response = yield call(getAreaCenterByAreaId, areaId);
      response = response.feature
      yield put({
        type: "saveCenter",
        payload: response
      });
    },
    *fetchGeoObject({ areaId, lat, lng, onNewGeoObject }, { call, put }) {
      const response = yield call(getGeoObject, areaId, lat, lng);

      onNewGeoObject(response);
    },
    *addCenter({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createAreaCenter, payload); // post

      if (response) {
        message.success(`Update Success!`);
        onSuccess && onSuccess();
      } else {
        message.error(`Update Fail.`);
        onError && onError();
      }
    },
    *removeCenter({ id }, { call, put }) {
      const response = yield call(deleteAreaCenter, id); // post
    },
    *updateCenter({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateAreaCenter, payload); // put

      response ? onSuccess(response) : onError();

      if (response) {
        message.success(`Update Success!`);
        // onSuccess && onSuccess();
      } else {
        message.error(`Update Fail.`);
        onError && onError();
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
    savePrimeLocations(state, action) {
      return {
        ...state,
        primeLocations: action.payload
      };
    },
    saveCenter(state, action) {
      return {
        ...state,
        area: action.payload
      };
    }
  }
};
