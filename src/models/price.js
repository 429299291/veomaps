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
    *get({ payload,onSuccess }, { call, put }) {
      let response = yield call(getAdminPrice, payload);
      const total = response.totalSize
      const page = response.page
      response = response.content
      if (Array.isArray(response)) {
        response.map(area => (area.key = area.id));
      }
      var tmp = response;
      // if (payload.areaId) {
      //   tmp = response.filter(function(itm) {
      //     return itm.areaId == payload.areaId;
      //   });
      // }
      onSuccess && onSuccess(response,total,page);
      yield put({
        type: "save",
        payload: Array.isArray(tmp) ? tmp : []
      });
    },
    *update({ id, payload, onSuccess, onError }, { call, put }) {
      console.log(payload);
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
