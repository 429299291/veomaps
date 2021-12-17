import {
    getCampaigns,
    addCampaigns,
    updateCampaigns
  } from "@/services/campaign";
  import { message } from "antd";
  
  export default {
    namespace: "campaign",
    state: {
      data: []
    },
  
    effects: {
        *get({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCampaigns, payload);
            onSuccess && onSuccess(response.content,response.page,response.pageSize,response.totalSize)
          },
        *add({ payload, onSuccess }, { call, put }) {
        const response = yield call(addCampaigns, payload);
        onSuccess && onSuccess()
        },
        *update({ id, payload, onSuccess, onError }, { call, put }) {
        const response = yield call(updateCampaigns, payload); // put
        console.log(response);
        if (response) {
          onSuccess && onSuccess();
        } else {
          message.error(`update Fail.`);
          onError && onError();
        }
      },
    },
  
    reducers: {
      save(state, action) {
  
        return {
          ...state,
          data: action.payload
        };
      }
    }
  };
  