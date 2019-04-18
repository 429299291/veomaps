import { stringify } from "qs";
import request from "@/utils/request";

export async function getVehicles(params) {
  return request(`/admins/vehicles?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getVehicleLocations(params) {
  return request(`/admins/vehicles/locations?${stringify(params, { indices: false })}`, {
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

export async function getStartPoints(areaId) {
  return request(
    `/admins/rides/${areaId}/start_points`,
    {
      method: "GET"
    }
  );
}

export async function updateAllLocations(params, id) {
  return request(
    `/admins/vehicles/locations/${id}?${stringify(params, { indices: false })}`,
    {
      method: "PUT"
    }
  );
}




export async function alertVehicle(vehicleId) {
  return request(
    `/admins/vehicles/${vehicleId}/find`,
    {
      method: "POST"
    }
  );
}





export async function addVehicle(params) {
  return request(`/admins/vehicles`, {
    method: "POST",
    body: {
      ...params
    }
  });
}

export async function getVehicleDetail(id) {
  return request(`/admins/vehicles/${id}/detail`, {
    method: "GET",
  });
}

export async function getVehicle(id) {
  return request(`/admins/vehicles/${id}`, {
    method: "GET",
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

export async function unlockVehicle(id) {
  return request(`/admins/vehicles/${id}/unlock`, {
    method: "PUT"
  });
}

export async function updateLocation(id) {
  return request(`/admins/vehicles/${id}/location`, {
    method: "PUT"
  });
}
