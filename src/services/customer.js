import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminCustomers(params) {
  return request(`/admins/customers?${stringify(params, { indices: false })}`, {
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
  return request(`/admins/customers/${id}`);
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
