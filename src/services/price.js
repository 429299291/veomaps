import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminPrice(params) {
  return request(`/admins/prices?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function createPrice(price) {
  return request(`/admins/prices`, {
    method: "POST",
    body: {
      ...price
    }
  });
}

export async function removePrice(id) {
  return request(`/admins/prices/${id}`, {
    method: "DELETE"
  });
}

export async function updatePrice(id, params) {
  return request(`/admins/prices/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}
