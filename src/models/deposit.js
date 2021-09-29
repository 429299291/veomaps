import {
    getAdminDeposits,
    updateDeposit,
    createDeposit,
    deleteDeposit,
  } from "@/services/deposit";
  import { message } from "antd";
  
  export default {
    namespace: "deposits",
  
    state: {
      total: 0,
      data: []
    },
  
    effects: {
      *get({ payload,onSuccess }, { call, put }) {
        let response = yield call(getAdminDeposits, payload);
        onSuccess(response.page,response.pageSize,response.totalSize)
        response = response.content
        if (Array.isArray(response)) {
          response.map(deposit => (deposit.key = deposit.id));
        }
        yield put({
          type: "save",
          payload: Array.isArray(response) ? response : []
        });
      },
      *update({ id, payload, onSuccess, onError }, { call, put }) {
        const response = yield call(updateDeposit, id, payload); // put
  
        if (response) {
          message.success(`Add Success, ID : ${response}`);
          onSuccess && onSuccess();
        } else {
          message.error(`Add Fail.`);
          onError && onError();
        }
      },
      *delete({ id, payload, onSuccess }, { call, put }) {
        const response = yield call(deleteDeposit, id); // delete 
  
        if (response) {
          onSuccess();
          message.success(`Successfully delete deposit with code`);
        } else {
          message.error(`Fail to delete deposit with code`);
        }
      },
      *add({ payload, onSuccess, onError }, { call, put }) {
        const response = yield call(createDeposit, payload); // delete
  
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
  