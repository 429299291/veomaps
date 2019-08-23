import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminPromos(params) {
  return request(`/admins/promos?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function updatePromo(id, params) {
    return request(`/admins/promos/${id}`, {
      method: "PUT",
      body: {
        ...params
      }
    });
  }

export async function createPromo(promo) {
  return request(`/admins/promos`, {
    method: "POST",
    body: {
      ...promo
    }
  });
}

export async function generatePromoWithCode(id, payload) {
  return request(`/admins/promos/${id}/code`, {
    method: "POST",
    body: {
      ...payload
    }
  });
}


