import request from "@/utils/request";

export async function createTechnician(technician) {
  return request(`/admins/technicians/register`, {
    method: "POST",
    body: {
      ...technician
    }
  });
}
