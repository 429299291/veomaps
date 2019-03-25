import {
  createTechnician,
  getTechnicians,
  removeTechnician
} from "@/services/technician";
import { message } from "antd";

export default {
  namespace: "technicians",

  state: {
    data: []
  },

  effects: {
    *get({ payload, onSuccess }, { call, put }) {
      const response = yield call(getTechnicians, payload);

      if (Array.isArray(response)) {
        response.map(technician => (technician.key = technician.id));
      }

      if (typeof onSuccess === "function") {
        onSuccess(response);
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });
    },

    *add({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createTechnician, payload);
      console.log({ payload });
      console.log(response);
      if (response) {
        message.success(`Add Success ID: ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error("Failure Adding Technician");
        onError && onError();
      }
    },

    *remove({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removeTechnician, id);

      if (response) {
        message.success(`Success Removing Technician: ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Failure Removing Technician`);
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
    }
  }
};
