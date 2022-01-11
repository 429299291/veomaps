import {
  getAdminMemberships,
  getMembershipDetail,
  createMembership,
  removeMembership,
  updateMembership,
  cancelAutoRenew
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
    *getDetail({ membershipId, onSuccess, onError }, { call, put }) {
      const response = yield call(getMembershipDetail, membershipId);

      if (response) {
        message.success(`Get Membership Detail Success, ID : ${membershipId}`);
        onSuccess && onSuccess(response);
      } else {
        message.error(`Get Membership Detail Fail, ID : ${membershipId}`);
        onError && onError();
      }
    },
    *cancelAutoRenew({payload},{call,put}){
      const response = yield call(cancelAutoRenew, payload); // put
      if(response==false){
        message.success(`cancel auto renew success,${response}`)
      }else{
        message.error(`cancel auto renew error,${response}`)
      }
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
    *remove({areaId, id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removeMembership,areaId, id); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *add({areaId, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createMembership,areaId, payload); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        // message.error(`Add Fail.`);
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
