import { stringify } from "qs";
import request from "@/utils/request";

// export async function getTechnicians(params) {
//   return request(
//     `/admins/technicians?${stringify(params, { indices: false })}`,
//     {
//       method: "GET"
//     }
//   );
// }
export async function getTechnicians(params) {
  return request(
    `/api/admins/technicians/${params}`,
    {
      method: "GET"
    }
  );
}
//api2
export async function getTechniciansAll(params) {
  return request(`/api/admins/technicians/search`,{
    method:'POST',
    body:{...params}
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

export async function upadteTechnician(technicianId, technician) {
  return request(`/admins/technicians/${technicianId}`, {
    method: "PUT",
    body: {
      ...technician
    }
  });
}
