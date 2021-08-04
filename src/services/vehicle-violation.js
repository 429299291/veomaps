import { stringify } from "qs";
import request from "@/utils/request";


// export async function getViolations(params) {
//     return request(`/admins/violations?${stringify(params, { indices: false })}`, {
//         method: "GET"
//     })
// }
export async function getViolations(params) {
    return request(`/api/admins/violations/search`, {
        method: "POST",
        body:params
        // body:params.areaId?{
        //     currentPage:params.currentPage,
        //     pageSize:params.pageSize,
        //     areaIds:[params.areaId],
        //     timeRange:{
        //         start:params.start,
        //         end:params.end
        //     }
        // }:{
        //     currentPage:params.currentPage,
        //     pageSize:params.pageSize,
        //     timeRange:{
        //         start:params.start,
        //         end:params.end
        //     }
        // }
    })
}

// export async function getViolationDatail(id) {
//     return request(`/admins/violations/${id}/detail`, {
//         method: "GET"
//     })
// }
export async function getViolationDatail(id) {
    return request(`/api/admins/violations/${id}`, {
        method: "GET"
    })
}


export async function countViolations(params) {
    return request(`/admins/violations/count?${stringify(params, { indices: false })}`, {
        method: "GET"
    })
}


// export async function updateViolation(id, body) {
//     return request(`/admins/violations/${id}`, {
//         method: "PUT",
//         body: body
//     })
// }
//???
export async function updateViolationReject(id, body) {
    return request(`/api/admins/violations/${id}/reject`, {
        method: "POST",
        body: body
    })
}
export async function updateViolationRevert(id, body) {
    return request(`/api/admins/violations/${id}/invert`, {
        method: "POST",
        body: body
    })
}
export async function updateViolationApprove(id, body) {
    return request(`/api/admins/violations/${id}/approve`, {
        method: "POST",
        body: body
    })
}
