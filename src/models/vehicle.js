import {
  getVehicles,
  countVehicles,
  getVehicleDetail,
  addVehicle,
  removeVehicle,
  updateVehicle,
  getVehicleOrders
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
