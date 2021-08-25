import { stringify } from "qs";
import request from "@/utils/request";

// export async function getNotifications(params) {
//   return request(`/admins/notifications?${stringify(params, { indices: false })}`,    
//   {
//     method: "GET"
//   });
// }
export async function getNotifications(params) {
  return request(`/api/admins/notifications/search`,    
  {
    method: "POST",
    body:{
      ...params
    }
  });
}

  
// export async function sendNotifications(areaId, type, params) {
//   return request(`/admins/notifications/areas/${areaId}/type/${type}`, {
//     method: "POST",
//     body: {
//       ...params
//     }
//   });
// }  
export async function sendNotifications(areaId, type, params) {
  return request(`/api/admins/notifications`, {
    method: "POST",
    body: {
      message:params.message,
      type,
      areaId
    }
  });
}