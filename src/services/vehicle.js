import { stringify } from "qs";
import request from "@/utils/request";

export async function getVehicles(params) {
  return request(`/admins/vehicles?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getVehicleOrders(vehicleId) {
  return request(`/admins/vehicles/${vehicleId}/orders`, {
    method: "GET"
  });
}

export async function countVehicles(params) {
  return request(
    `/admins/vehicles/total?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function getVehicleDetail(id) {
  //return request(`/admins/vehicles/${id}`);
}

export async function addVehicle(params) {
  return request(`/admins/vehicles`, {
    method: "POST",
    body: {
      ...params
    }
  });
}

export async function removeVehicle(id) {
  return request(`/admins/vehicles/${id}`, {
    method: "DELETE"
  });
}

export async function updateVehicle(id, params) {
  return request(`/admins/vehicles/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}
