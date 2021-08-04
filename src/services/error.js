import request from '@/utils/request';
import { stringify } from "qs";

export async function getAdminErrors(params) {
  return request(`/admins/errors?${stringify(params, { indices: false })}`, {
    method: "GET"
  });
}
// export async function getAdminErrors(params) {
//   return request(`/api/admins/errors/search`, {
//     method: "POST",
//     body:{
//       ...params
//     }
//   });
// }

export async function getImages(errorId) {
  return request(`/admins/errors/${errorId}/image_paths`, {
    method: "GET"
  });
}

export async function getErrorDetail(id) {
  return request(`/admins/errors/${id}`);
}

export async function batchPassErrors(errorIds) {
  return request(`/admins/errors/batch_pass`, {
    method: "POST",
    body: errorIds
  });
}

export async function removeError(id) {
  return request(`/admins/errors/${id}`, {
    method: "DELETE"
  });
}

export async function updateError(id, params) {
  return request(`/admins/errors/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}

