import { stringify } from "qs";
import request from "@/utils/request";

export async function getOrders(query) {
    return request(`/admins/commerces/orders/search`, {
        method: "POST",
        body: {
            ...query
        }
    })
}

export async function countOrders(query) {
    return request(`/admins/commerces/orders/count`, {
        method: "POST",
        body: {
            ...query
        }
    })
}




export async function updateOrder(id, body) {
    return request(`/admins/commerces/orders/${id}`, {
        method: "PUT",
        body: {
            ...body
        }
    })
}