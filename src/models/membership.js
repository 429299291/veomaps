import {
  getAdminMemberships,
  getMembershipDetail,
  createMembership,
  removeMembership,
  updateMembership
} from "@/services/membership";
import { message } from "antd";

export default {
  namespace: "memberships",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(getAdminMemberships, payload);

      if (Array.isArray(response)) {
        response.map(membership => (membership.key = membership.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateMembership, id, payload); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *remove({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removeMembership, id); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *add({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createMembership, payload); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        total: action.payload.length
      };
    }
  }
};
