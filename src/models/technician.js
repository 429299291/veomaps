import {
  createTechnician,
  getTechnicians,
  getTechniciansAll,
  removeTechnician,
  upadteTechnician
} from "@/services/technician";
import { message } from "antd";

export default {
  namespace: "technicians",

  state: {
    data: [],
    newData:[]
  },

  effects: {
    *get({ payload, onSuccess }, { call, put }) {
      const response = yield call(getTechnicians, payload);

      if (Array.isArray(response)) {
        response.map(technician => (technician.key = technician.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    },
    // api2
    *getAll({payload,onSuccess},{call,put}){
      const {content} = yield call(getTechniciansAll,payload);
      yield put({
        type: "save",
        payload: Array.isArray(content) ? content : []
      });
      if (typeof onSuccess === "function") {
        onSuccess(content);
      }
    },

    *add({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createTechnician, payload);
      if (response) {
        message.success(`Add Success ID: ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error("Failure Adding Technician");
        onError && onError();
      }
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(upadteTechnician, id, payload);

      if (response) {
        message.success(`Success Update Technician: ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Failure Update Technician`);
        onError && onError();
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    newSave(state, action) {
      return {
        ...state,
        newData: action.payload
      };
    },
  }
};
