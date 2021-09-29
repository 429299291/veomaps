import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminDeposits(params) {
  params.pagination.page = params.pagination.page > 0 ? params.pagination.page-1 : 0
  return request(`/api/admins/areas/deposits/search`, {
    method: "POST",
    body:{
      ...params
    }
  });
}

export async function updateDeposit(id, params) {
    return request(`/api/admins/areas/deposits/${id}`, {
      method: "PATCH",
      body: {
        ...params
      }
    });
  }

  export async function deleteDeposit(id, params) {
    return request(`/api/admins/areas/deposits/${id}`, {
      method: "DELETE"
    });
  }

export async function createDeposit(deposit) {
  return request(`/api/admins/areas/deposits`, {
    method: "POST",
    body: {
      ...deposit
    }
  });
}



