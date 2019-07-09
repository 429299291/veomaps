import { stringify } from "qs";
import request from "@/utils/request";


export async function getRideCount(params) {
  return request(`/admins/dashboard/ride_count?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getCustomerCount(params) {
  return request(`/admins/dashboard/customer_count?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getRidePerVehicleRank(params) {
  return request(`/admins/dashboard/ride_per_vehicle_rank?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getDailyRideCount(params) {
  return request(`/admins/dashboard/daily_ride_count?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getDailyBatteryState(params) {
  return request(`/admins/dashboard/daily_battery_state?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getDailyRevenue(params) {
  return request(`/admins/dashboard/stripe_revenue?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}