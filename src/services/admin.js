import { stringify } from "qs";
import request from "@/utils/request";
import { message, Button } from "antd";
export async function getAdmins(payload) {
  return request(`/api/admins/search`, {
    method: "POST",
    body: payload
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
  return request(`/api/admins/${id}`, {
    method: "PATCH",
    body: {
      ...params
    }
  });
}

export async function updateAdminPassword(adminId, newPassword) {
  return request(`/api/admins/${adminId}`, {
    method: "PATCH",
    body: {
      password: newPassword
    }
  });
}

export async function registerByEmail(email) {
  return request(`/api/admins`, {
    method: "POST",
    body: email
  });
}
export async function adminSearch(payload) {
  return request("/api/admins/search", {
    method: "POST",
    body: payload
  })
    .then(response => {
      if (response.content.length > 0) {
        message.success("search successful");
      } else {
        message.success("none");
      }
      return response;
    })
    .catch(err => {
      console.log(err);
    });
}
