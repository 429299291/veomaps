import { stringify } from "qs";
import request from "@/utils/request";

const url = "/api/admins/custom-technician-messages";

export async function getMessage(id) {
    return request(`/admins/custom-technician-messages/${id}`, {
        method: "GET"
    })
}

export async function getMessages(params) {
    return request(`/api/admins/violations/types?${stringify(params, { indices: false })}`, {
        method: "GET"
    })
}
// export async function getMessages(params) {
//     return request(`/api/admins/violations/search`, {
//         method: "POST",
//         body:{}
//     })
// }

// export async function createMessage(message) {
//     return request(`​/api/admins/violations/types`, {
//         method: "POST",
//         body: {
//             ...message
//         }
//     })
// }
export async function createMessage(message) {
    return request(`/api/admins/violations/types`,{
        method:'POST',
        body:{
            ...message
        }})
}
export async function getCustomerApprovedViolationCount(customerId) {
    return request(`/admins/customers/${customerId}/approved_violation_count`, {
        method: "GET",
    })
}

// export async function updateMessage(id, message) {
//     return request(`/admins/custom-technician-messages/${id}`, {
//         method: "PUT",
//         body: {
//             ...message
//         }
//     })
// }
export async function updateMessage(id, message) {
    return request(`/api/admins/violations/types/${id}`, {
        method: "PATCH",
        body: {
            ...message
        }
    })
}