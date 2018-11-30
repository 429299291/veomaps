import {
  getAdminCustomers,
  getAdminCustomersTotal,
  getCustomerDetail,
  createCustomer,
  removeCustomer,
  updateCustomer
} from "@/services/customer";
import { message } from "antd";

export default {
  namespace: "customers",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      const total = yield call(getAdminCustomersTotal, payload);

      const data = yield call(getAdminCustomers, payload);

      if (Array.isArray(data)) {
        data.map(bike => (bike.key = bike.id));
      }

      yield put({
        type: "save",
        data: Array.isArray(data) ? data : [],
        total: total
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(createCustomer, payload); // post

      if (response) {
        message.success(`Add Success, ID : ${response}`);
      } else {
        message.error(`Add Fail.`);
      }
    },
    *remove({ id }, { call, put }) {
      const response = yield call(removeCustomer, id); // post
    },
    *update({ id, payload, onSuccess }, { call, put }) {
      const response = yield call(updateCustomer, id, payload); // put

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
