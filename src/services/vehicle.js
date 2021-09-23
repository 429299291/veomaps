import { stringify } from "qs";
import request from "@/utils/request";

// export async function getVehicles(params) {
//   return request(`/admins/vehicles?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }

export async function getVehicles(params) {
  return request(`/api/admins/vehicles/search`, {
    method: "POST",
    body: {
      ...params
    }
  });
}

// export async function getVehicleLocations(params) {
//   console.log('---');
//   return request(`/admins/vehicles/locations?${stringify(params, { indices: false })}`, {
//     method: "GET"
//   });
// }
// export async function getVehicleLocations(params) {
//   console.log(params);
//   return request(`/api/admins/areas/search`, {
//     method: "POST",
//     body:{
//       ...params
//     }
//   });
// }

//null data
// export async function getVehicleOrders(vehicleId) {
//   return request(`/admins/vehicles/${vehicleId}/orders`, {
//     method: "GET"
//   });
// }

export async function countVehicles(params) {
  return request(
    `/admins/vehicles/total?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function getStartPoints(areaId, params) {
  return request(
    `/admins/rides/${areaId}/start_points?${stringify(params, { indices: false })}`,
    {
      method: "GET"
    }
  );
}

export async function applyAction(vehicleNumber, payload) {
  return request(
    `/admins/vehicles/${vehicleNumber}/action`,
    {
      method: "POST",
      body: {
        ...payload
      }
    }
  );
}


export async function getAreaSessionLocation(fieldValues, areaId) {
  return request(
    `/admins/customers/session-heat-map?areaId=${areaId}&${stringify(fieldValues, { indices: false })}`,
    {
      method: "GET",
    }
  );
}

export async function getVehicleSnapshot(fieldValues) {
  return request(
    `/admins/vehicles/snapshot?${stringify(fieldValues, { indices: false })}`,
    {
      method: "GET",
    }
  );
}

export async function handleGetPrimLocationSnapshot(fieldValues) {
  return request(
    `/admins/vehicles/prime-location-snapshot?${stringify(fieldValues, { indices: false })}`,
    {
      method: "GET",
    }
  );
}

export async function updateAllLocations(params, id) {
  return request(
    `/admins/vehicles/locations/${id}?${stringify(params, { indices: false })}`,
    {
      method: "PUT"
    }
  );
}




export async function alertVehicle(vehicleId) {
  return request(
    `/admins/vehicles/${vehicleId}/find`,
    {
      method: "POST"
    }
  );
}





export async function addVehicle(params) {
  return request(`/admins/vehicles`, {
    method: "POST",
    body: {
      ...params
    }
  });
}

// export async function getVehicleDetail(id) {
//   return request(`/admins/vehicles/${id}/detail`, {
//     method: "GET",
//   });
// }
export async function getVehicleDetail(id) {
  return request(`/api/admins/vehicles/${id}`, {
    method: "GET",
  });
}

// export async function getVehicle(id) {
//   return request(`/admins/vehicles/${id}`, {
//     method: "GET",
//   });
// }
export async function getVehicle(id) {
  return request(`/api/admins/vehicles/${id}`, {
    method: "GET",
  });
}

export async function removeVehicle(id) {
  return request(`/admins/vehicles/${id}`, {
    method: "DELETE"
  });
}

export async function updateVehicle(id, params) {
  return request(`/api/admins/vehicles/${id}`, {
    method: "PATCH",
    body: {
      ...params
    }
  });
}

export async function unlockVehicle(id) {
  return request(`/api/admins/vehicles/${id}/unlock`, {
    method: "POST"
  });
}

// export async function getRef(id) {
//   return request(`/admins/vehicles/${id}/location/reference`, {
//     method: "GET"
//   });
// }

export async function lockVehicle(id) {
  return request(`/api/admins/vehicles/${id}/lock`, {
    method: "POST"
  });
}

export async function updateLocation(id) {
  return request(`/api/admins/vehicles/${id}/location`, {
    method: "POST"
  });
}

export async function restart(id) {
  return request(`/admins/vehicles/${id}/restart`, {
    method: "POST"
  });
}

export async function getStatus(id) {
  return request(`/api/admins/vehicles/${id}/status`, {
    method: "GET"
  });
}

export async function controlVehicle(id, params) {
  return request(`/admins/vehicles/${id}/control`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}

export async function controlVehicleExtension(id, params) {
  return request(`/admins/vehicles/${id}/control_extension`, {
    method: "PUT",
    body: {
      ...params
    }
  });
}
export async function controlVoice(params) {
  return request(`/api/admins/vehicles/${params.vehicleId}/voice`, {
    method: "POST",
    body: {
      type:params.type,
      times:params.times
    }
  });
}
