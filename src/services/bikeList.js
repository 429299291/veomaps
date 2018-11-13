import { stringify } from "qs";
import request from "@/utils/request";

export async function queryBikes(params) {
  return request(`/admins/vehicles?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function queryBikesCount(params) {
  return request(
    `/admins/vehicles/total?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function queryBike(id) {
  //return request(`/admins/vehicles/{id}`);
}

export async function addBike(params) {
  return request(`/admins/vehicles`, {
    method: "POST",
    body: {
      ...params
    }
  });
}

export async function removeBike(id) {
  return request(`/admins/vehicles/{id}`, {
    method: "DELETE"
  });
}

export async function updateBike(id) {
  return request(`/admins/vehicles/{id}`, {
    method: "PUT/",
    body: {
      ...params
    }
  });
}
