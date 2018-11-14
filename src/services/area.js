import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminAreas(params) {
  return request(`/admins/areas?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getAreaDetail(id) {
  return request(`/admins/areas/${id}`);
}

export async function createArea(area) {
  return request(`/admins/areas`, {
    method: "POST",
    body: {
      ...area
    }
  });
}

export async function removeArea(id) {
  return request(`/admins/areas/${id}`, {
    method: "DELETE"
  });
}

export async function updateArea(id, params) {
  return request(`/admins/areas/${id}`, {
    method: "PUT/",
    body: {
      ...params
    }
  });
}
