import request from "@/utils/request";

export async function query() {
  return request("/api/users");
}

export async function queryCurrent() {
  return request("/api/currentUser");
}

export async function accountLogin(params) {
  return request("/auth/admins/signin", {
    method: "POST",
    body: params
  });
}

export async function getMe() {
  return request("/admins/me", {
    method: "GET"
  });
}

export async function updateToken() {
  return request("/admins/auth/new_token", {
    method: "GET"
  });
}
