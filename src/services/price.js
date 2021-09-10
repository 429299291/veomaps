import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminPrice(params) {
  return request('/api/admins/areas/prices/search', {
    method: "POST",
    body:{
      ...params
    }
  });
}

export async function createPrice(price) {
  return request(`/api/admins/areas/prices`, {
    method: "POST",
    body: {
      ...price
    }
  });
}

export async function removePrice(id) {
  return request(`/api/admins/areas/prices/${id}`, {
    method: "DELETE"
  });
}

export async function updatePrice(id, params) {
  return request(`/api/admins/areas/prices/${id}`, {
    method: "PATCH",
    body: {
      price:params.price,
      frequency:params.frequency,
      unlockFee:params.unlockFee,
      vehicleType:params.vehicleType,
    }
  });
}
