import {
  getAdminCoupons,
  getCouponDetail,
  createCoupon,
  removeCoupon,
  updateCoupon
} from "@/services/coupon";
import { message } from "antd";

export default {
  namespace: "coupons",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(getAdminCoupons, payload);

      if (Array.isArray(response)) {
        response.map(coupon => (coupon.key = coupon.id));
      }

      yield put({
        type: "save",
        payload: Array.isArray(response) ? response : []
      });
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(updateCoupon, id, payload); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *remove({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removeCoupon, id); // delete

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *add({ payload, onSuccess, onError }, { call, put }) {
      const response = yield call(createCoupon, payload); // delete

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
