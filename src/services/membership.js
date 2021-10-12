import { stringify } from "qs";
import request from "@/utils/request";

// export async function getAdminMemberships(params) {
//   return request(
//     `/admins/memberships?${stringify(params, { indices: false })}`,
//     {
//       method: "GET"
//     }
//   );
// }
export async function getAdminMemberships(params) {
  return request(
    `/api/admins/areas/${params.areaId}/memberships/search${params.name? `?name=${params.name}` :''}`,
    {
      method: "GET"
    }
  );
}

export async function getMembershipDetail(id) {
  return request(`/admins/memberships/${id}/detail`,    
  {
    method: "GET"
  });
}

export async function createMembership(areaId,membership) {
  return request(`/api/admins/areas/${areaId}/memberships`, {
    method: "POST",
    body: {
      ...membership
    }
  });
}

export async function removeMembership(areaId,id) {
  return request(`/api/admins/areas/${areaId}/memberships/${id}`, {
    method: "DELETE"
  });
}

export async function updateMembership(id, params) {
  return request(`/api/admins/areas/${params.areaId}/memberships/${id}`, {
    method: "PATCH",
    body: {
      ...params
    }
  });
}
