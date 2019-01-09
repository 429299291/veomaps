import {
  getAdminRides,
  getAdminRidesTotal,
  getRideDetail,
  createRide,
  removeRide,
  updateRide,
  getRideRoute,
  endRide,
  getCustomerRides
} from "@/services/ride";
import { message } from "antd";

export default {
  namespace: "rides",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      const total = yield call(getAdminRidesTotal, payload);

      const data = yield call(getAdminRides, payload);

      if (Array.isArray(data)) {
        data.map(bike => (bike.key = bike.id));
      }

      yield put({
        type: "save",
        data: Array.isArray(data) ? data : [],
        total: total
      });
    },
    *getCustomerRides({ customerId, onSuccess }, { call, put }) {
      const rides = yield call(getAdminRides, { customerId: customerId });

      if (Array.isArray(rides)) {
        rides.map(ride => (ride.key = ride.id));
        onSuccess(rides);
      } else {
        message.error("Fail to get customer rides.");
      }
    },
    *getVehicleRides({ vehicleId, onSuccess }, { call, put }) {
      const rides = yield call(getAdminRides, { vehicleId: vehicleId });

      if (Array.isArray(rides)) {
        rides.map(ride => (ride.key = ride.id));
        onSuccess(rides);
      } else {
        message.error("Fail to get customer rides.");
      }
    },
    *getRoute({ rideId, onSuccess, onFail }, { call, put }) {
      const path = yield call(getRideRoute, rideId);

      if (path && Array.isArray(path)) {
        onSuccess(path);
      }
    },
    *endRide({ rideId, minutes, onSuccess }, { call, put }) {
      const response = yield call(endRide, rideId, minutes); // put

      response && onSuccess(response);
    },
    *update({ id, payload, onSuccess }, { call, put }) {
      const response = yield call(updateRide, id, payload); // put

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
