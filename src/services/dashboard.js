import { stringify } from "qs";
import request from "@/utils/request";

export async function getVehicleLocationDetail(areaId) {
  return request(`/admins/vehicles/location_details/${areaId}`, {
    method: "GET"
  });
}

