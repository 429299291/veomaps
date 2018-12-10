import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdmins(params) {
  return request(`/admins`, {
    method: "GET"
  });
}

export async function getAdminDetail(id) {
  return request(`/admins/${id}`);
}

export async function createAdmin(admin) {
  return request(`/admins/register`, {
    method: "POST",
    body: {
      ...admin
    }
  });
}

export async function removeAdmin(id) {
  return request(`/admins/${id}`, {
    method: "DELETE"
  });
}

export async function updateAdmin(id, params) {
  return request(`/admins/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}

export async function updateAdminPassword(adminId, newPassword) {
  return request(`/admins/${adminId}/update_password`, {
    method: "POST",
    body: {
      newPassword: newPassword
    }
  });
}
