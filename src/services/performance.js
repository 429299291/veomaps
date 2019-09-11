import { stringify } from "qs";
import request from "@/utils/request";

export async function getHistoryData(params) {
  return request(`/admins/analytics/analytic-report?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getRankingData(params) {
  return request(`/admins/analytics/areas?${stringify(params, { indices: false })}&sort=finalScore`, {
    method: "GET"
  });
}


