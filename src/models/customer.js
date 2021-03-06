import {
  getAdminCustomers,
  getAdminCustomersTotal,
  getCustomerDetail,
  createCustomer,
  removeCustomer,
  updateCustomer,
  getCustomerPayments,
  buyMembership,
  getMembership,
  getAvailableMemberships,
  getCustomerTransactions,
  refund,
  updateMembership,
  getTempCode,
  customerRefund
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
      // const total = yield call(getAdminCustomersTotal, payload);

      let Alldata = yield call(getAdminCustomers, payload);
      const data = Alldata.content


      if (Array.isArray(data)) {
        data.map(bike => (bike.key = bike.id));
      }
      yield put({
        type: "save",
        data: Array.isArray(data) ? data : [],
        total: Alldata.totalSize
      });
    },
    *getTempCode({phoneNumber, onSuccess}, { call, put }) {
      const data = yield call(getTempCode, phoneNumber);

      if (data) {
        onSuccess && onSuccess(data);
      } else {
        message.error("Password Incorrect.");
      }
    },
    *getAll({ payload, onSuccess }, { call, put }) {

      const data = yield call(getAdminCustomers, payload);

      if (data) {
        onSuccess && onSuccess(data);
      } else {
        message.error("Download Fail!");
      }
    },
    *updateMembership({  customerId, params, onSuccess }, { call, put }) {
      const data = yield call(updateMembership, customerId, params);
      if (data) {
        onSuccess(data);
      } else {
        message.error(`Fail!`);
      }
    },
    *getTransactions({ payload, onSuccess }, { call, put }) {

      let data = yield call(getCustomerTransactions, payload);
      const total = data.totalSize
      const page = data.page
      const pageSize = data.pageSize
      data = data.content
      if (data) {
        data.forEach(element => {
          element.key = element.id
        });
        onSuccess && onSuccess(data,page,pageSize,total);
      } else {
        message.error("Get Transactions Fail!");
      }
    },
    *customerPayments({ payload, onSuccess }, { call, put }) {
      const response = yield call(getCustomerPayments, payload);

      if (Array.isArray(response)) {
        response.map(coupon => (coupon.key = coupon.id));
      }

      onSuccess && onSuccess(Array.isArray(response) ? response : []);
    },
    *getCustomerDetail({ payload, customerId, onSuccess }, { call, put }) {
      const data = yield call(getCustomerDetail, customerId);

      if (data) {
        onSuccess(data);
      } else {
        message.error(`Fail!`);
      }
    },
    *buyMembership({  customerId, planId, onSuccess, onFail }, { call, put }) {
      const data = yield call(buyMembership, customerId, planId);

      if (data) {
        message.success("Buy Membership Success!");
        onSuccess && onSuccess(data);
      } else {
        onFail && onFail();
      }
    },
    *refund({  id, params, onSuccess }, { call, put }) {
      const data = yield call(refund, id, params);

      if (data) {
        message.success("Refund Success!");
        onSuccess();
      } else {
        message.error(`Refund Fail!`);
      }
    },
    *customerRefund({transactionId,payload},{call,put}){
      const data = yield call(customerRefund,transactionId, payload)
      if (data) {
        message.success("Refund Success!");
      } else {
        message.error(`Refund Fail!`);
      }
    },
    *getMembership({  customerId, onSuccess }, { call, put }) {
      const data = yield call(getMembership, customerId);

      if (data) {
        onSuccess(data);
      }
    },
    *getAvailableMemberships({  customerId, onSuccess }, { call, put }) {
      const data = yield call(getAvailableMemberships, customerId);
      if (data) {
        onSuccess(data);
      }
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
