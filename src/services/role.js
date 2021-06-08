import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminRoles(params) {
  return request(`/api/admins/roles`, {
    method: "GET"
  });
}

export async function getRoleDetail(id) {
  return request(`/admins/roles/${id}`);
}

export async function createRole(role) {
  return request(`/admins/roles`, {
    method: "POST",
    body: {
      ...role
    }
  });
}

export async function removeRole(id) {
  return request(`/admins/roles/${id}`, {
    method: "DELETE"
  });
}

export async function updateRole(id, params) {
  return request(`/admins/roles/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}
