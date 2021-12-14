import { stringify } from "qs";
import request from "@/utils/request";
import { message } from "antd";
export async function getNotification(params) {
  return request(`/api/admins/notifications/search`, {
    method: "POST",
    body:{
      ...params
    }
  });
}
export async function addNotification(params) {
  return request(`/api/admins/notifications`, {
    method: "POST",
    body:{
      ...params
    }
  });
}
export async function updateNotification(params) {
  return request(`/api/admins/notifications/${params.id}/update`, {
    method: "POST",
    body:{
        category:params.category,
        amount:params.amount,
        segment:params.segment,
        begin:params.begin,
        expiration:params.expiration
      },
  });
}
