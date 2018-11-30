import { stringify } from "qs";
import request from "@/utils/request";

export async function getFencesByAreaId(areaId) {
  return request(`/admins/geo/fences?areaId=${areaId}`, {
    method: "GET"
  });
}

export async function createFence(fence) {
  return request(`/admins/geo/fences`, {
    method: "POST",
    body: {
      ...fence
    }
  });
}

export async function updateFence(fenceId, area) {
  return request(`/admins/geo/fences/${fenceId}`, {
    method: "PUT",
    body: {
      ...area
    }
  });
}

export async function deleteFence(id) {
  return request(`/admins/geo/fences/${id}`, {
    method: "DELETE"
  });
}

export async function getAreaCenterByAreaId(areaId) {
  return request(`/admins/geo/area_center?areaId=${areaId}`, {
    method: "GET"
  });
}

export async function createAreaCenter(center) {
  return request(`/admins/geo/area_center`, {
    method: "POST",
    body: {
      ...center
    }
  });
}

export async function updateAreaCenter(centerId, center) {
  return request(`/admins/geo/area_center/${centerId}`, {
    method: "PUT",
    body: {
      ...center
    }
  });
}

export async function deleteAreaCenter(id) {
  return request(`/admins/geo/area_center/${id}`, {
    method: "DELETE"
  });
}
