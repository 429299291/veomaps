import { stringify } from "qs";
import request from "@/utils/request";
import { message } from "antd";
export async function getCampaigns(params) {
  return request(`/api/admins/campaign/search`, {
    method: "POST",
    body:{
      ...params
    }
  });
}
export async function addCampaigns(params) {
  return request(`/api/admins/campaign`, {
    method: "POST",
    body:{
      ...params
    }
  });
}
export async function updateCampaigns(params) {
  return request(`/api/admins/campaign/${params.id}/update`, {
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
