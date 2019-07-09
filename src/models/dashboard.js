import {
  getRideCount,
  getCustomerCount,
  getRidePerVehicleRank,
  getDailyRideCount,
  getDailyBatteryState,
  getDailyRevenue
} from "@/services/dashboard";
import { message } from "antd";

export default {
  namespace: "dashboard",

  state: {
    rideCountData: [],
    customerCountData: [],
    ridePerVehicleRank: [],
    dailyRideCount: {},
    dailyBatteryState: {},
    stripeRevenue: {}
  },

  effects: {
    *fetchRideCount({params}, { call, put }) {
      const response = yield call(getRideCount, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            rideCountData: response
          }
        });
      }
     
    },

    *fetchCustomerCount({params}, { call, put }) {
      const response = yield call(getCustomerCount, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            customerCountData: response
          }
        });
      }
    },

    *getRidePerVehicleRank({params}, { call, put }) {
      const response = yield call(getRidePerVehicleRank, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            ridePerVehicleRank: response
          }
        });
      }
    },

    *fetchDailyRideCounts({params}, { call, put }) {
      const response = yield call(getDailyRideCount, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            dailyRideCount: response
          }
        });
      }
    },

    *fetchDailyBatteryState({params}, { call, put }) {
      const response = yield call(getDailyBatteryState, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            dailyBatteryState: response
          }
        });
      }
    },

    *fetchRevenue({params}, { call, put }) {
      const response = yield call(getDailyRevenue, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            stripeRevenue: response
          }
        });
      }
    }
    

  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    clear() {
      return {
        rideCountData: [],
        customerCountData: [],
        ridePerVehicleRank: [],
        dailyRideCount: {},
        dailyBatteryState: {},
        stripeRevenue: {}
      };
    }
  }
};
