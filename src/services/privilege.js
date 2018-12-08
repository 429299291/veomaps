import { stringify } from "qs";
import request from "@/utils/request";

export async function updateRolePrivileges(roleId, privilegeIds) {
  return request(`/admins/roles/${roleId}/update_privileges`, {
    method: "PUT",
    body: privilegeIds
  });
}

export async function updatePrivilege(id, params) {
  return request(`/admins/privileges/${id}`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}

export async function getPrivieges() {
  return request(`/admins/privileges`, {
    method: "GET"
  });
}
