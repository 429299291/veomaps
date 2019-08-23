import { stringify } from "qs";
import request from "@/utils/request";

export async function getNotifications(params) {
    return request(`/admins/notifications?${stringify(params, { indices: false })}`,    
    {
      method: "GET"
    });
  }
  
  
  export async function sendNotifications(areaId, type, params) {
    return request(`/admins/notifications/areas/${areaId}/type/${type}`, {
      method: "POST",
      body: {
        ...params
      }
    });
  }