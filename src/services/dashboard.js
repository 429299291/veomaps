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

export async function getWeeklyBatteryState(params) {
  return request(`/admins/dashboard/weekly_battery_state?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getDailyRideRevenue(params) {
  return request(`/admins/dashboard/daily_ride_revenue?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getStripeDailyRevenue(params) {
  return request(`/admins/dashboard/stripe_revenue?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}


export async function getStripRevenueByPeriod(params) {
  return request(`/admins/dashboard/stripe_revenue_by_period?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getConnectivityByPeriod(params) {
  return request(`/admins/dashboard/connectivity?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getAreaTotalMinutes(params) {
  return request(`/admins/dashboard/total_minutes?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getAreaTotalDistance(params) {
  return request(`/admins/dashboard/total_area_distance?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}
