import {
  getAdminRides,
  getAdminRidesTotal,
  getRideDetail,
  createRide,
  removeRide,
  updateRide,
  getRideRoute,
  getRideImage,
  endRide,
  getCustomerRides,
  refundRide,
  getRefundCalculateResult,
  getRideBillingInfo
} from "@/services/ride";
import {
  getViolationDatail
} from '@/services/vehicle-violation';
import { message } from "antd";

export default {
  namespace: "rides",

  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      // const total = yield call(getAdminRidesTotal, payload);
      let data = yield call(getAdminRides, payload);
      const total = data.totalSize
      data = data.content

      if (Array.isArray(data)) {
        data.map(bike => (bike.key = bike.id));
      }

      yield put({
        type: "save",
        data: Array.isArray(data) ? data : [],
        total: total
      });
    },
    *detail({ id, onSuccess, onError }, { call, put }) {
      const result = yield call(getRideDetail, id);
      if (result) {
        onSuccess(result);
      } else {
        onError();
      }
    },
    *violationRideDetail({ id, onSuccess, onError }, { call, put }) {
      console.log(id);
      const response = yield call(getViolationDatail, id);
      const result = yield call(getRideDetail, response.violationRideInfo.rideId,);
      if (result) {
        onSuccess(result);
      } else {
        onError();
      }
    },
    *billingInfo({ id, onSuccess }, { call, put }) {
      const result = yield call(getRideBillingInfo, id);
      if (result) {
        onSuccess(result);
      }
    },

    *refund({ id, payload, onSuccess }, { call, put }) {
      const isSuccess = yield call(refundRide, id, payload);

      if (isSuccess) {
        onSuccess();
        message.success("Successfuly Refund this Ride.");
      } else {
        message.error("Fail to Refund this Ride");
      }
    },

    *getAll({ payload, onSuccess }, { call, put }) {
      const data = yield call(getAdminRides, payload);

      if (data) {
        onSuccess && onSuccess(data);
      } else {
        message.error("Fail to get all rides.");
      }
    },
    *getRefundCalculateResult({ id, payload, onSuccess }, { call, put }) {
      console.log('models');
      const data = yield call(getRefundCalculateResult, id, payload);
      if (data) {
        onSuccess && onSuccess(data);
      } else {
        message.error("Fail to get all rides.");
      }
    },
    *image({ rideId, onSuccess, onError }, { call, put }) {
      const url = yield call(getRideImage, rideId);
      console.log('---');

      if (url && typeof url === "string") {
        onSuccess(url);
      } else {
        onError();
      }
    },
    *getCustomerRides({ payload, onSuccess }, { call, put }) {
      let rides = yield call(getAdminRides,payload);
      const totalSize = rides.totalSize
      const current = rides.current
      rides = rides.content
      if (Array.isArray(rides)) {
        rides.map(ride => (ride.key = ride.id));
        onSuccess(rides,totalSize,current);
      } else {
        message.error("Fail to get customer rides.");
      }
    },
    *getVehicleRides({ payload, onSuccess }, { call, put }) {
      let rides = yield call(getAdminRides,payload);
      const totalSize = rides.totalSize
      const current = rides.page
      rides = rides.content
      if (Array.isArray(rides)) {
        rides.map(ride => (ride.key = ride.id));
        onSuccess(rides,totalSize,current);
      } else {
        message.error("Fail to get customer rides.");
      }
    },
    *getRoute({ rideId, onSuccess, onFail }, { call, put }) {
      const path = yield call(getRideRoute, rideId);
      if (path && typeof path === "object") {
        onSuccess(path);
      }
    },
    *endRide({ rideId, minutes, onSuccess }, { call, put }) {
      const response = yield call(endRide, rideId, minutes); // put
      response && setTimeout(()=>{
        onSuccess(response)
      },3000) ;
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
