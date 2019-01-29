import {
  getVehicleLocationDetail,
} from "@/services/dashboard";
import { message } from "antd";

export default {
  namespace: "dashboard",

  state: {
    vehicleLocations: []
  },

  effects: {
    *getVehicleDetail({ areaId }, { call, put }) {
      const vehicles = yield call(getVehicleLocationDetail, areaId);

      if (Array.isArray(vehicles)) {
        vehicles.map(vehicle => (vehicle.key = vehicle.id));
      }

      yield put({
        type: "save",
        vehicleLocations: Array.isArray(vehicles) ? vehicles : [],
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        vehicleLocations: action.vehicleLocations,
      };
    }
  }
};
