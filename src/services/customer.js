import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminCustomers(params) {
  return request(`/admins/customers?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function getCustomerPayments(customerId) {
  return request(`/admins/customers/${customerId}/charge_history`, {
    method: "GET"
  });
}

export async function getCustomerTransactions(customerId) {
  return request(`/admins/customers/${customerId}/transactions`, {
    method: "GET"
  });
}

export async function getTempCode(phoneNumber) {
  return request(`/api/admins/customers/phone/${phoneNumber}/auth-code`, {
    method: "GET"
  });
}


export async function getAdminCustomersTotal(params) {
  return request(
    `/admins/customers/count?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function getCustomerDetail(id) {
  return request(`/admins/customers/${id}`, {
    method: "GET"
  });
}

export async function createCustomer(area) {
  return request(`/admins/customers`, {
    method: "POST",
    body: {
      ...area
    }
  });
}

export async function removeCustomer(id) {
  return request(`/admins/customers/${id}`, {
    method: "DELETE"
  });
}

export async function updateCustomer(id, params) {
  return request(`/admins/customers/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}

export async function refund(id, params) {
  return request(`/admins/customers/${id}/refund`, {
    method: "POST",
    body: {
      ...params
    }
  });
}

export async function getMembership(customerId) {
  return request(`/admins/memberships/customers/${customerId}`, {
    method: "GET"
  });
}

export async function getAvailableMemberships(customerId) {
  return request(`/api/admins/customers/${customerId}/memberships/options`, {
    method: "GET"
  });
}

export async function buyMembership(customerId, planId) {
  return request(`/api/admins/customers/${customerId}/memberships/${planId}/buy`, {
    method: "POST",
    body: {
      isAutoRenew: false
    }
  });
}
export async function updateMembership(customerId, params) {
  return request(`/admins/memberships/customers/${customerId}/buy`, {
    method: "POST",
    body: {
      ...params
    }
  });
}
