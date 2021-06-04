import request from "@/utils/request";

export async function query() {
  return request("/api/users");
}

export async function queryCurrent() {
  return request("/api/currentUser");
}

export async function accountLogin(params) {
  return request("/api/admins/auth/auth-code", {
    method: "POST",
    body: params
  });
}

// export async function getMe() {
//   return request("/admins/me", {
//     method: "GET"
//   });
// }
export async function getMe() {
  return request("/admins/me", {
    method: "GET"
  });
}

export async function getNewMe() {
  return request("/api/admins", {
    method: "GET"
  });
}

export async function updateToken() {
  return request("/admins/auth/new_token", {
    method: "GET"
  });
}



export async function updateMe(me) {
  return request(`/api/admins`, {
    method: "PATCH",
    body: {
      ...me
    }
  });
}

export async function verifyPhoneNumber(params) {
  return request("/api/admins/auth/auth-code/verification", {
    method: "POST",
    body: params
  });
}




export async function updatePassword(newPassword) {
  return request(`/admins/me/update_password`, {
    method: "PUT",
    body: {
      newPassword: newPassword
    }
  });
}