import { stringify } from "qs";
import request from "@/utils/request";


export async function getRideCount(params) {
  return request(`/api/admins/dashboard/ride_count?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getCustomerCount(params) {
  return request(`/api/admins/dashboard/customer_count?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getRidePerVehicleRank(params) {
  return request(`/api/admins/dashboard/ride_per_vehicle_rank?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getStripeNetCharge(params) {
  return request(`/api/admins/dashboard/stripe-net-charge?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getStripeNetDeposit(params) {
  return request(`/api/admins/dashboard/stripe-net-deposit?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getStripeNetDispute(params) {
  return request(`/api/admins/dashboard/stripe-net-dispute?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getStripeNetRefund(params) {
  return request(`/api/admins/dashboard/stripe-net-refund?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

// export async function getDailyRideCount(params) {
//   return request(`/admins/dashboard/daily_ride_count?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }
export async function getDailyRideCount(params) {
  return request(`/api/admins/rides/search`, {
    method: "POST",
    body:{
      ...params
    }
  })
}

export async function getWeeklyBatteryState(params) {
  return request(`/api/admins/dashboard/weekly_battery_state?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getDailyRideRevenue(params) {
  return request(`/api/admins/dashboard/daily_ride_revenue?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

// export async function getStripeDailyRevenue(params) {
//   return request(`/api/admins/dashboard/stripe_revenue?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }
export async function getStripeDailyRevenue(params) {
  return request(`/api/admins/dashboard/customer/revenue/statistics`, {
    method: "POST",
    body:{
      areaIds:[params.areaId],
      midnight:params.midnight
    }
  });
}


// export async function getStripRevenueByPeriod(params) {
//   return request(`/api/admins/dashboard/stripe_revenue_by_period?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }
export async function getStripRevenueByPeriod(params) {
  return request(`/api/admins/dashboard/customer/${params.period}/revenue/histogram`, {
    method: "POST",
    body:{
      areaIds:[params.areaId],
      beginTime:params.start,
      endTime:params.end,
      offset:params.offset
    }
  });
}


export async function getConnectivityByPeriod(params) {
  return request(`/api/admins/dashboard/connectivity?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getAreaTotalMinutes(params) {
  return request(`/api/admins/dashboard/total_minutes?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

// export async function getAreaTotalDistance(params) {
//   return request(`/admins/dashboard/total_area_distance?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }

export async function getTotalRideRevenue(params) {
  return request(`/api/admins/dashboard/ride_revenue_by_vehicle_type?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getTotalRefund(params) {
  return request(`/api/admins/dashboard/total_refund?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getPromoSummary(params) {
  return request(`/api/admins/dashboard/promo-summary?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

