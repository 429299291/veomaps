import {
  getAdminPrice,
  createPrice,
  removePrice,
  updatePrice
} from "@/services/price";
import { message } from "antd";

export default {
  namespace: "price",
  state: {
    total: 0,
    data: []
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(getAdminPrice, payload);

      if (Array.isArray(response)) {
        response.map(area => (area.key = area.id));
      }
      var tmp = response;
      if (payload.areaId) {
        tmp = response.filter(function(itm) {
          return itm.areaId == payload.areaId;
        });
      }

      yield put({
        type: "save",
        payload: Array.isArray(tmp) ? tmp : []
      });
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      payload["updated"] = new Date().toUTCString();
      const response = yield call(updatePrice, id, payload); // put

      if (response) {
        message.success(`Add Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Add Fail.`);
        onError && onError();
      }
    },
    *remove({ id, payload, onSuccess, onError }, { call, put }) {
      const response = yield call(removePrice, id); // delete

      if (response) {
        message.success(`Remove Success, ID : ${response}`);
        onSuccess && onSuccess();
      } else {
        message.error(`Remove Fail.`);
        onError && onError();
      }
    },
    *add({ payload, onSuccess, onError }, { call, put }) {
      payload["created"] = new Date().toUTCString();
      payload["updated"] = new Date().toUTCString();

      const response = yield call(createPrice, payload); // delete

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
        areaPrice: action.payload,
        total: action.payload.length
      };
    }
  }
};
