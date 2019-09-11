import {
    getHistoryData,
    getRankingData
  } from "@/services/performance";
  import { message } from "antd";
  
  export default {
    namespace: "performance",
  
    state: {
        historyData: [],
        rankingData: [],
    },
  
    effects: {
      *getHistoryData({ params }, { call, put }) {
  
        const response = yield call(getHistoryData, params);

        

        if (response) {
          yield put({
            type: "save",
            payload: {
                historyData: response.map(item => Object.assign(item, {period: `${item.filterYear}-${item.filterMonth}-${item.filterDay}`} ))
            }
          });
        }
      },

      *getRankingData({params}, {call, put}) {

        const response = yield call(getRankingData, params);


        if (response) {
            yield put({
              type: "save",
              payload: {
                rankingData: response
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
                historyData: [],
                rankingData: [],
            };
          }
    }
  };
  