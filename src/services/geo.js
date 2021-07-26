import { stringify } from "qs";
import request from "@/utils/request";

export async function createPrimeLocation(primeLocation) {
  return request(`/admins/prime-locations`, {
    method: "POST",
    body: {
      ...primeLocation
    }
  });
}

export async function handleCheckPrimeLocation(areaId, payload) {
  return request(`/admins/prime-locations/area/${areaId}/by-location`, {
    method: "POST",
    body: {
      ...payload
    }
  });
}


export async function updateHub(hub) {
  return request(`/api/admins/areas/hubs/${hub.id}`, {
    method: "PATCH",
    body: {
      ...hub
    }
  });
}

export async function getPrimeLocationByAreaId(areaId) {
  return request(`/api/admins/areas/${areaId}/hubs`, {
    method: "GET",
  });
}

export async function getGeoObject(areaId,lat, lng) {
  return request(`/api/admins/areas/${areaId}/geo-object?lat=${lat}&lng=${lng}`, {
    method: "GET",
  });
}

export async function deletePrimeLocation(id) {
  return request(`/api/admins/areas/hubs/${id}`, {
    method: "DELETE",
  });
}

// export async function getFencesByAreaId(areaId) {
//   return request(`/admins/geo/fences?areaId=${areaId}`, {
//     method: "GET"
//   });
// }
export async function getFencesByAreaId(areaId) {
  return request(`/api/admins/areas/${areaId}/fences`, {
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



export async function examineParking(areaId, imei, lat, lng) {
  return request(`/admins/geo/examine_parking_test?lat=${lat}&lng=${lng}&areaId=${areaId}&imei=${imei}`, {
    method: "GET"
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


