import {
    getAdminPromos,
    updatePromo,
    createPromo,
    generatePromoWithCode,
  } from "@/services/promo";
  import { message } from "antd";
  
  export default {
    namespace: "promos",
  
    state: {
      total: 0,
      data: []
    },
  
    effects: {
      *get({ payload,onSuccess }, { call, put }) {
        let response = yield call(getAdminPromos, payload);
        const current = response.page
        const total = response.totalSize
        response = response.content
        if (Array.isArray(response)) {
          response.map(promo => (promo.key = promo.id));
        }
        onSuccess && onSuccess(response,total,current);
        yield put({
          type: "save",
          payload: Array.isArray(response) ? response : []
        });
      },
      *update({ id, payload, onSuccess, onError }, { call, put }) {
        const response = yield call(updatePromo, id, payload); // put
  
        if (response) {
          message.success(`Add Success, ID : ${response}`);
          onSuccess && onSuccess();
        } else {
          message.error(`Add Fail.`);
          onError && onError();
        }
      },
      *generateCodePromo({ payload }, { call, put }) {

        const response = yield call(generatePromoWithCode, payload); // gen code
  
        if (response) {
          message.success(`Successfully add promo with code`);
        } else {
          message.error(`Fail to Add promo with code`);
        }
      },
      *add({ payload, onSuccess, onError }, { call, put }) {
        const response = yield call(createPromo, payload); // delete
  
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
  