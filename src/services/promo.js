import { stringify } from "qs";
import request from "@/utils/request";

// export async function getAdminPromos(params) {
//   return request(`/admins/promos?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }
export async function getAdminPromos(params) {
  return request(`/api/admins/promos/search`, {
    method: "POST",
    body:{
      ...params
    }
  });
}

export async function updatePromo(id, params) {
  return request(`/api/admins/promos/${id}`, {
    method: "PATCH",
    body: {
      ...params
    }
  });
}

export async function createPromo(promo) {
  return request(`/api/admins/promos`, {
    method: "POST",
    body: {
      ...promo
    }
  });
}

// export async function generatePromoWithCode(id, payload) {
//   return request(`/admins/promos/${id}/code`, {
//     method: "POST",
//     body: {
//       ...payload
//     }
//   });
// }
export async function generatePromoWithCode(params) {
  return request(`/api/admins/customers/promos`, {
    method: "POST",
    body: {
      ...params
    }
  });
}


