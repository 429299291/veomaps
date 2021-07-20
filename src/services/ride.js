import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminRides(params) {
  return request(`/admins/rides?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}
// export async function getAdminRides(params) {
//   return request(`/api/admins/rides?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }

export async function getAdminRidesTotal(params) {
  return request(
    `/admins/rides/count?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function refundRide(id, fieldValues) {
  return request(`/api/admins/rides/${id}/refund`, {
    method: "POST",
    body: fieldValues
  });
}

export async function getRideRoute(rideId) {
  return request(`/api/admins/rides/${rideId}/path`, {
    method: "GET"
  });
}

export async function endRide(rideId, minutes) {
  return request(`/admins/rides/${rideId}/end`, {
    method: "PUT",
    body: minutes
  });
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

export async function getRideImage(rideId) {
  return request(`/admins/rides/${rideId}/image`, {
    method: "GET"
  });
}

export async function getRideDetail(id) {
  return request(`/api/admins/rides/${id}`, {
    method: "GET"
  });
}

export function getRefundCalculateResult(id, payload) {
  return request(`/api/admins/rides/${id}/refund/calculate`, {
    method: "POST",
    body: {
      ...payload
    }
  });
}

export async function getRideBillingInfo(id, payload) {
  return request(`/api/admins/rides/${id}/detail`, {
    method: "GET"
  });
}
