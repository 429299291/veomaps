import { stringify } from "qs";
import request from "@/utils/request";
import { message } from "antd";
export async function getNotification(params) {
  return request(`/api/admins/customers/notifications/search`, {
    method: "POST",
    body:{
      ...params
    }
  });
}
export async function addNotification(params) {
  return request(`/api/admins/customers/notifications`, {
    method: "POST",
    body:{
      ...params
    }
  });
}
export async function updateNotification(params) {
  return request(`/api/admins/customers/notifications/${params.id}/update`, {
    method: "POST",
    body:{
        title:params.title,
        text:params.text,
        begin:params.begin,
        expire:params.expire
      },
  });
}
