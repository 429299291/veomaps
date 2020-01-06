import { stringify } from "qs";
import request from "@/utils/request";


export async function getViolations(params) {
    return request(`/admins/violations?${stringify(params, { indices: false })}`, {
        method: "GET"
    })
}

export async function getViolationDatail(id) {
    return request(`/admins/violations/${id}/detail`, {
        method: "GET"
    })
}


export async function countViolations(params) {
    return request(`/admins/violations/count?${stringify(params, { indices: false })}`, {
        method: "GET"
    })
}


export async function updateViolation(id, body) {
    return request(`/admins/violations/${id}`, {
        method: "PUT",
        body: body
    })
}