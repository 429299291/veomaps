import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryBikes(params) {
  //return request(`/api/fake_list?${stringify(params)}`);
  return request(`/admins/vehicles`);
}

export async function queryBike(id) {
  //return request(`/admins/vehicles/{id}`);
}

export async function addBike(params) {
  return request(`/admins/vehicles`, {
    method: 'POST',
    body: {
      ...params
    }
  });
}

export async function removeBike(id) {
  return request(`/admins/vehicles/{id}`, {
    method: 'DELETE'
  });
}

export async function updateBike(id) {
  return request(`/admins/vehicles/{id}`, {
    method: 'PUT/',
    body: {
      ...params
    }
  });
}