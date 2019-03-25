import { stringify } from "qs";
import request from "@/utils/request";

export async function getTechnicians(params) {
  return request(
    `/admins/technicians?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function createTechnician(technician) {
  return request(`/admins/technicians/register_by_email`, {
    method: "POST",
    body: {
      ...technician
    }
  });
}

export async function removeTechnician(technicianId) {
  return request(`/admins/technicians/${technicianId}`, {
    method: "DELETE"
  });
}
