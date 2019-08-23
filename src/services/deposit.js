import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminDeposits(params) {
  return request(`/admins/deposits?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}

export async function updateDeposit(id, params) {
    return request(`/admins/deposits/${id}`, {
      method: "PUT",
      body: {
        ...params
      }
    });
  }

  export async function deleteDeposit(id, params) {
    return request(`/admins/deposits/${id}`, {
      method: "DELETE"
    });
  }

export async function createDeposit(deposit) {
  return request(`/admins/deposits`, {
    method: "POST",
    body: {
      ...deposit
    }
  });
}



