import {
  getVehicles,
  countVehicles,
  getVehicleDetail,
  getVehicle,
  addVehicle,
  removeVehicle,
  updateVehicle,
  getVehicleOrders,
  unlockVehicle,
  updateLocation,
  alertVehicle,
  getVehicleLocations,
  updateAllLocations,
  getStartPoints
} from "@/services/vehicle";
import { message } from "antd";

export default {
  namespace: "vehicles",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      const total = yield call(countVehicles, payload);

      const data = yield call(getVehicles, payload);

      if (Array.isArray(data)) {
        data.map(bike => (bike.key = bike.id));
      }

      yield put({
        type: "save",
        data: Array.isArray(data) ? data : [],
        total: total
      });
    },
    *getStartPoints({areaId, onSuccess}, {call, put}) {
      const data = yield call(getStartPoints, areaId);
      if (data) {
        onSuccess && onSuccess(data);
      } else {
        message.error("fail to fetch vehicle location" + data);
      }
    },
    *getVehicleDetail({vehicleId, onSuccess}, {call, put}) {
      const data = yield call(getVehicleDetail, vehicleId);
      if (data) {
        onSuccess(data);
      } else {
        message.error("fail to fetch vehicle location" + data);
      }
    },
    *updateAllLocations({payload, areaId}, {call, put}) {
      const data = yield call(updateAllLocations, payload, areaId);
      if (data) {
        message.success("Successfully to update" + data.successfullySend + "vehicle location out of " + data.totalToSend + " total bikes.");
      } else {
        message.error("fail to update all vehicle location "+ data);
      }
    },
    *getVehicleLocation({payload, onSuccess}, {call, put}) {
      const data = yield call(getVehicleLocations, payload);
      if (data) {
        onSuccess(data);
      } else {
        message.error("fail to fetch vehicle location" + data);
      }
    },

    *alertVehicle({vehicleId, onSuccess}, {call, put}) {
      const data = yield call(alertVehicle, vehicleId);
      if (data) {
        message.success("Successfully beep vehicle.");
      } else {
        message.error("fail to beep vehicle " + data);
      }
    },
    *getVehicle({vehicleId, onSuccess}, {call, put}) {
      const data = yield call(getVehicle, vehicleId);
      if (data) {
        onSuccess(data);
      } else {
        message.error("fail to fetch vehicle location" + data);
      }
    },
    *getOrders({ id, onSuccess }, { call, put }) {
      const data = yield call(getVehicleOrders, id);


      if (Array.isArray(data)) {
        data.map(item => (item.key = item.id));
      }

      onSuccess && onSuccess(data);
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addVehicle, payload); // post

      if (response) {
        message.success(`Add Success, ID : ${response}`);
      } else {
        message.error(`Add Fail.`);
      }
    },
    *remove({ id }, { call, put }) {
      const response = yield call(removeVehicle, id); // post
    },
    *unlock({ id, onSuccess }, { call, put }) {
      const response = yield call(unlockVehicle, id); // post

      if (response) {
        message.success(`Unlock Success, ID : ${response}`);
        typeof onSuccess === "function" && onSuccess();
      } else {
        message.error(`Unlock Fail.`);
      }
    },
    *updateLocation({ id, onSuccess }, { call, put }) {
      const response = yield call(updateLocation, id); // post

      if (response) {
        message.success(`Update location Success`);
        typeof onSuccess === "function" && onSuccess();
      } else {
        message.error(`Update location Fail`);
      }
    },
    *update({ id, payload, onSuccess }, { call, put }) {
      const response = yield call(updateVehicle, id, payload); // put

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
    save(state, action) {
      return {
        ...state,
        data: action.data,
        total: action.total
      };
    }
  }
};
