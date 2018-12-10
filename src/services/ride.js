import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminRides(params) {
  return request(`/admins/rides?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getAdminRidesTotal(params) {
  return request(
    `/admins/rides/count?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function getRideRoute(rideId) {
  return request(`/admins/rides/${rideId}/route`, {
    method: "GET"
  });
}

export async function endRide(rideId, minutes) {
  return request(`/admins/rides/${rideId}/end`, {
    method: "PUT",
    body: minutes
  });
}

export async function getRideDetail(id) {
  return request(`/admins/rides/${id}`);
}

export async function createRide(area) {
  return request(`/admins/rides`, {
    method: "POST",
    body: {
      ...area
    }
  });
}

export async function removeRide(id) {
  return request(`/admins/rides/${id}`, {
    method: "DELETE"
  });
}

export async function updateRide(id, params) {
  return request(`/admins/rides/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}