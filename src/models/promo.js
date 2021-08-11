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
      *get({ payload }, { call, put }) {
        let response = yield call(getAdminPromos, payload);
        response = response.content
        response = [
          {
            "id": 2,
            "name": "Promo Create Test",
            "days": 7,
            "amount": 15,
            "areaId": 2,
            "redeemCount": 0,
            "promoType": 1,
            "created": "2019-04-24T03:41:53.000+0000",
            "updated": "2021-08-11T03:19:39.000+0000"
        },
        {
          "id": 2,
          "name": "Promo Create Test",
          "days": 7,
          "amount": 15,
          "areaId": 2,
          "redeemCount": 0,
          "promoType": 1,
          "created": "2019-04-24T03:41:53.000+0000",
          "updated": "2021-08-11T03:19:39.000+0000"
      },
      {
        "id": 2,
        "name": "Promo Create Test",
        "days": 7,
        "amount": 15,
        "areaId": 2,
        "redeemCount": 0,
        "promoType": 1,
        "created": "2019-04-24T03:41:53.000+0000",
        "updated": "2021-08-11T03:19:39.000+0000"
    },
    {
      "id": 2,
      "name": "Promo Create Test",
      "days": 7,
      "amount": 15,
      "areaId": 2,
      "redeemCount": 0,
      "promoType": 1,
      "created": "2019-04-24T03:41:53.000+0000",
      "updated": "2021-08-11T03:19:39.000+0000"
  },
  {
    "id": 2,
    "name": "Promo Create Test",
    "days": 7,
    "amount": 15,
    "areaId": 2,
    "redeemCount": 0,
    "promoType": 1,
    "created": "2019-04-24T03:41:53.000+0000",
    "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
{
  "id": 2,
  "name": "Promo Create Test",
  "days": 7,
  "amount": 15,
  "areaId": 2,
  "redeemCount": 0,
  "promoType": 1,
  "created": "2019-04-24T03:41:53.000+0000",
  "updated": "2021-08-11T03:19:39.000+0000"
},
]
        if (Array.isArray(response)) {
          response.map(promo => (promo.key = promo.id));
        }
  
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
      *generateCodePromo({ id, payload }, { call, put }) {

        const response = yield call(generatePromoWithCode, id, payload); // gen code
  
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
  