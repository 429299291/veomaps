import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminCoupons(params) {
  return request(`/admins/coupons?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getCouponDetail(id) {
  return request(`/admins/coupons/${id}`);
}

export async function createCoupon(coupon) {
  return request(`/admins/coupons`, {
    method: "POST",
    body: {
      ...coupon
    }
  });
}

export async function removeCoupon(id) {
  return request(`/admins/coupons/${id}`, {
    method: "DELETE"
  });
}

export async function updateCoupon(id, params) {
  return request(`/admins/coupons/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}
