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
  getConnectivityByPeriod,
  getAreaTotalDistance,
  getAreaTotalMinutes,
  getTotalRideRevenue,
  getTotalRefund,
  getStripeNetDeposit,
  getStripeNetDispute,
  getStripeNetRefund,
  getStripeNetCharge,
  getPromoSummary
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
    totalRideMinutes: {},
    totalRideDistance: {},
    totalRefund: {},
    totalRideRevenue: []
  },

  effects: {
    *fetchRideCount({params}, { call, put }) {
      const response = yield call(getRideCount, params);


      if (response) {


        response.sort((a, b) => {

          const aDateString = a.x.split(' ').join('');

          const bDateString = b.x.split(' ').join('');

          const ax = new Date(aDateString );
          
          const bx = new Date(bDateString );
        
         return ax.getTime() - bx.getTime();
        });

        const vehicleTypes = ['bike', 'scooter', 'ebike', 'COSMO']

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
            rideCountData: response
          }
        });
      }


      // if (response) {
      //   yield put({
      //     type: "save",
      //     payload: {
      //       rideCountData: response
      //     }
      //   });
      // }
     
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

        const vehicleTypes = ['bike', 'scooter', 'ebike', 'COSMO']

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

    *fetchStripeNetDeposit({params}, { call, put }) {
      const response = yield call(getStripeNetDeposit, params);

      if (!isNaN(response)) {
        yield put({
          type: "save",
          payload: {
            stripeNetDeposit: response
          }
        });
      }
    },

    *fetchStripeNetCharge({params}, { call, put }) {
      const response = yield call(getStripeNetCharge, params);

      if (!isNaN(response)) {
        yield put({
          type: "save",
          payload: {
            stripeNetCharge: response
          }
        });
      }
    },

    *fetchStripeNetRefund({params}, { call, put }) {
      const response = yield call(getStripeNetRefund, params);

      if (!isNaN(response)) {
        yield put({
          type: "save",
          payload: {
            stripeNetRefund: response
          }
        });
      }
    },

    

    *fetchStripeNetDispute({params}, { call, put }) {
      const response = yield call(getStripeNetDispute, params);


      if (!isNaN(response)){
        yield put({
          type: "save",
          payload: {
            stripeNetDispute: response
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
    },

    *fetchAreaMinutes({params}, { call, put }) {
      const response = yield call(getAreaTotalMinutes, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            totalRideMinutes: response
          }
        });
      }

    },

    *fetchAreaDistance({params}, { call, put }) {
      const response = yield call(getAreaTotalDistance, params);

      if (response) {
        yield put({
          type: "save",
          payload: {
            totalRideDistance: response
          }
        });
      }

    },

    *fetchTotalRefund({params}, { call, put }) {
      const response = yield call(getTotalRefund, params);

      yield put({
        type: "save",
        payload: {
          totalRefund: response ? response : {}
        }
      });
    },

    *fetchTotalRideRevenue({params}, { call, put }) {
      const response = yield call(getTotalRideRevenue, params);

     
        yield put({
          type: "save",
          payload: {
            totalRideRevenue: response
          }
        });
      
    },

    *fetchPromoSummary({params}, { call, put }) {
      const response = yield call(getPromoSummary, params);

        yield put({
          type: "save",
          payload: {
            promoSummary: response
          }
        });
      
    }



  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    clearMinutesAndDistance(state) {
      return {
        ...state,
        totalRideDistance: {},
        totalRideMinutes: {},
      }
    },

    clear() {
      return {
        rideCountData: [],
        customerCountData: [],
        ridePerVehicleRank: [],
        dailyRideCount: {},
        batteryState: {},
        stripeRevenue: {},
        rideRevenue: {},
        totalRideDistance: {},
        totalRideMinutes: {},
        totalRefund: {},
        stripeNetDeposit: undefined,
        stripeNetDispute: undefined,
        stripeNetRefund: undefined,
        stripeNetCharge: undefined,
        promoSummary: undefined,
        totalRideRevenue: "loading",
        
        
      };
    }
  }
};
