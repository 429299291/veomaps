import {
  getRideCount,
  getCustomerCount,
  getRidePerVehicleRank,
  getDailyRideCount,
  getDailyBatteryState,
  getStripeDailyRevenue,
  getDailyRideRevenue,
  getWeeklyBatteryState,
  getStripRevenueByPeriod,
  getConnectivityByPeriod
} from "@/services/dashboard";
import { message } from "antd";

export default {
  namespace: "dashboard",

  state: {
    rideCountData: [],
    customerCountData: [],
    ridePerVehicleRank: [],
    dailyRideCount: {},
    batteryState: {},
    stripeRevenue: {},
    dailyRideRevenue: {},

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

    *fetchDailyRideRevenue({params}, { call, put }) {
      const response = yield call(getDailyRideRevenue, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            dailyRideRevenue: response
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

    *fetchStripRevenueByPeriod({params}, { call, put }) {
      const response = yield call(getStripRevenueByPeriod, params);

      if (response) {

        yield put({
          type: "save",
          payload: {
            stripeRevenueData: response.map(item =>{return {x: item.x, y: item.y / 100} })
          }
        });
      }
    },

    *fetchConnectivityByPeriod({params}, { call, put }) {
      const response = yield call(getConnectivityByPeriod, params);

      if (response) {


        response.sort((a, b) => {

          const aDateString = a.x.split(' ').join('');

          const bDateString = b.x.split(' ').join('');

          const ax = new Date(aDateString );
          
          const bx = new Date(bDateString );
        
         return ax.getTime() - bx.getTime();
        });

        const vehicleTypes = ['bike', 'scooter', 'ebike']

        vehicleTypes[null] = 'all';

        const formatResponse = response.map(item => {
            Object.keys(item.y).map(key => {
              
              item.y[vehicleTypes[key]] = item.y[key];

              delete item.y[key];

            })
        }); 

        yield put({
          type: "save",
          payload: {
            connectivity: response
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

    *fetchWeeklyBatteryState({params}, { call, put }) {
      const response = yield call(getWeeklyBatteryState, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            batteryState: response
          }
        });
      }
    },

    *fetchStripeDailyRevenue({params}, { call, put }) {
      const response = yield call(getStripeDailyRevenue, params);


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
        batteryState: {},
        stripeRevenue: {},
        rideRevenue: {}
      };
    }
  }
};
