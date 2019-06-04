import {
    getNotifications,
    sendNotifications
  } from "@/services/notifications";
  import { message } from "antd";
  
  export default {
    namespace: "notifications",
  
    state: {
      customer: []
    },
  
    effects: {
      *getForCustomer({ payload }, { call, put }) {
  
        const data = yield call(getNotifications, payload);
  
        if (Array.isArray(data)) {
          data.map(bike => (bike.key = bike.id));
        }
  
        yield put({
          type: "save",
          data: Array.isArray(data) ? data : []
        });
      },

      *sendForCustomers({areaId, messageType, payload, onSuccess}, {call, put}) {
        const data = yield call(sendNotifications, areaId, messageType, { "message" : payload});
        if (data) {
          message.success("Successfully Send Notifications.");
          onSuccess && onSuccess();
        } else {
          message.error("Fail to Send Notifications " + data);
        }
      }
    },
  
    reducers: {
      save(state, action) {
        return {
          ...state,
          customer: action.data
        };
      }
    }
  };
  