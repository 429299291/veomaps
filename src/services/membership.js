import { stringify } from "qs";
import request from "@/utils/request";

export async function getAdminMemberships(params) {
  return request(
    `/admins/memberships?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function getMembershipDetail(id) {
  return request(`/admins/memberships/${id}`);
}

export async function createMembership(membership) {
  return request(`/admins/memberships`, {
    method: "POST",
    body: {
      ...membership
    }
  });
}

export async function removeMembership(id) {
  return request(`/admins/memberships/${id}`, {
    method: "DELETE"
  });
}

export async function updateMembership(id, params) {
  return request(`/admins/memberships/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}
