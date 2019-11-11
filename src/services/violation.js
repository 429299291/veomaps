import { stringify } from "qs";
import request from "@/utils/request";

const url = "/api/admins/custom-technician-messages";

export async function getMessage(id) {
    return request(`/admins/custom-technician-messages/${id}`, {
        method: "GET"
    })
}

export async function getMessages() {
    return request(`/admins/custom-technician-messages`, {
        method: "GET"
    })
}

export async function createMessage(message) {
    return request(`/admins/custom-technician-messages`, {
        method: "POST",
        body: {
            ...message
        }
    })
}

export async function updateMessage(id, message) {
    console.log({id});
    return request(`/admins/custom-technician-messages/${id}`, {
        method: "PUT",
        body: {
            ...message
        }
    })
}