import fetch from "dva/fetch";
import { notification } from "antd";
import router from "umi/router";
import hash from "hash.js";
import { isAntdPro } from "./utils";

//const urlPrefix = "https://localhost:8444/api";
//const urlPrefix = "https://develop.veoride.com:8444/api"
const urlPrefix = "https://manhattan-dev.veoride.com:8444/api";

export const ACCESS_TOKEN = "accessToken";

export const TOKEN_CREATE_DATE = "tokenCreateDate"

const codeMessage = {
  200: "The server successfully returned the requested data.",
  201: "New or modified data is successful.",
  202: "A request has entered the background queue (asynchronous task).",
  204: "Delete data successfully.",
  400: "The request was made with an error, and the server did not perform operations to create or modify data.",
  401: "User don't have permission (token, username, password).",
  403: "User is authorized, but access is forbidden.",
  404: "The request was made to a record that does not exist, and the server did not operate.",
  406: "The format of the request is not available.",
  410: "The requested resource is permanently deleted and will not be obtained again.",
  422: "When creating an object, a validation error occurred.",
  500: "The server has an error, please check the server.",
  502: "Gateway error.",
  503: "The service is unavailable, the server is temporarily overloaded or maintained.",
  504: "Gateway timed out."
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `Request Error ${response.status}: ${response.url}`,
    description: errortext
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  url = urlPrefix + url;

  const headers = new Headers({
    "Content-Type": "application/json"
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
    );
  }

  const defaults = { headers };
  if (options.body) {
    options.body = JSON.stringify(options.body);
  }
  const newOptions = Object.assign({}, defaults, options);

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response =>
      response.json().then(json => {
        if (!response.ok || (json.code && json.code != 0)) {
          return Promise.reject(json);
        }
        return json && json.data;
      })
    )
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        window.g_app._store.dispatch({
          type: "login/logout"
        });
        localStorage.removeItem(ACCESS_TOKEN);
        router.push("/user/login");
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push("/exception/403");
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push("/exception/500");
        return;
      }
      if (status >= 404 && status < 422) {
        router.push("/exception/404");
      }
    });
}
