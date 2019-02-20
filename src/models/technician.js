import { createTechnician } from "@/services/technician";
import { message } from "antd";

export default {
  namespace: "technicians",

  state: {
    data: []
  },

  effects: {
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
