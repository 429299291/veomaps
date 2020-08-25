import { stringify } from "qs";
import request from "@/utils/request";

export async function getListings(query) {
    return request(`/admins/commerces/listings`, {
        method: "GET"
    })
}


export async function updateListing(id, body) {
    return request(`/admins/commerces/listings/items/${id}`, {
        method: "PUT",
        body: {
            ...body
        }
    })
}