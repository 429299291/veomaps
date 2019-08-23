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
  lockVehicle,
  updateLocation,
  alertVehicle,
  getVehicleLocations,
  updateAllLocations,
  getStartPoints,
  getStatus,
  getRef,
  restart,
  applyAction
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
    *getStartPoints({areaId, params, onSuccess}, {call, put}) {
      const data = yield call(getStartPoints,  areaId, params);
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
    *getStatus({vehicleId, onSuccess}, {call, put}) {
      const data = yield call(getStatus, vehicleId);
      if (data) {
        onSuccess(data);
      } else {
        message.error("fail to get vehicle status" + data);
      }
    },
    *getRef({ id, onSuccess }, { call, put }) {
      const response = yield call(getRef, id); // get

      if (response) {
        typeof onSuccess === "function" && onSuccess(response);
      } else {
        //message.error(`Get Ref Fail`);
      }
    },
    *restart({vehicleId, onSuccess}, {call, put}) {
      const data = yield call(restart, vehicleId);
      if (data) {
        onSuccess(data);
      } else {
        message.error("fail to restart vehicle" + data);
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
        message.success(`Unlock Success, ID : ${id}`);
        typeof onSuccess === "function" && onSuccess();
      } else {
        message.error(`Unlock Fail.`);
      }
    },
    *lock({ id, onSuccess }, { call, put }) {
      const response = yield call(lockVehicle, id); // post

      if (response) {
        message.success(`Lock Success, ID : ${id}`);
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

      if (response) {
        message.success(`Update Success!`);
        onSuccess();
      } else {
        message.error(`Update Fail.`);
      }
    },
    *applyAction({ id, vehicleNumber, payload, onSuccess }, { call, put }) {

      const response = yield call(applyAction, vehicleNumber, payload);

      if (response) {
        message.success(`Applying acition  Success!`);
        onSuccess();
      } else {
        message.error(`Appuing action Fail.`);
      }

      //unlock vehicle after applying action
      const type = payload.actionType === 0 ? "unlock" : "lock";

      yield put({
        type: type,
        id: id,
        onSuccess: () => { 
          message.success("successfully " + type + " vehicle."); 
          setTimeout(onSuccess, 3000);
        }
      });
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
