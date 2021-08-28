import { stringify } from "qs";
import request from "@/utils/request";
import { message } from "antd";

// export async function getAdminAreas(params) {
//   return request(`/admins/areas?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }
export async function getAdminAreas(params) {
  return request(`/api/admins/areas/search`, {
    method: "POST",
    body:{
      ...params
    }
  });
}

export async function getAllAreas() {
  return request(`/admins/areas/all`, {
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

export async function removeArea(id) {getHubUploadUrl
  return request(`/admins/areas/${id}`, {
    method: "DELETE"
  });
}

export async function updateArea(id, params) {
  return request(`/admins/areas/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}

export async function createAreaFeature(feature) {
  return request(`/admins/areas/features`, {
    method: "POST",
    body: {
      ...feature
    }
  });
}

export async function updateAreaFeature(featureId, feature) {
  return request(`/api/admins/areas/features/${featureId}`, {
    method: "PATCH",
    body: {
      ...feature
    }
  });
}

export async function getAreaFeatures() {
  return request(`/admins/areas/features`, {
    method: "GET"
  });
}

export async function getHubImageUploadUrl(hubId) {
  return request(`/admins/areas/hubs/${hubId}/upload-url`, {
    method: "GET"
  });
}

export async function getAreaFeature(areaId) {
  return request(`/api/admins/areas/${areaId}/features`, {
    method: "GET"
  });
}
//new api
export async function getAreasAll(areaId) {
  return request(`/api/admins/areas/${areaId.areaId}`, {
    method: "GET"
  });
}
export async function addArea(params) {
  return request(`/api/admins/areas`, {
    method: "POST",
    body:{...params}
  })
  .then(response=>{
    if(response.status==500){
      message.error('add error')
    }else if(response == true){
      message.success('add area success')
    }
    return response
  })
  .catch(err=>{message.error(err)});
}
export async function updateAreaNew(areaId,params) {
  return request(`/api/admins/areas/${areaId}`, {
    method: "PATCH",
    body:{...params}
  })
  .then(response=>{
    if(response.status!==200){
      message.success('edit area success')
    }
  });
}

