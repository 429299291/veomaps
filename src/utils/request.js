import fetch from "dva/fetch";
import { notification } from "antd";
import router from "umi/router";
import hash from "hash.js";
import { isAntdPro } from "./utils";

const urlPrefix = "https://localhost:8444/api";
//const urlPrefix = "https://develop.veoride.com:8444/api"
//const urlPrefix = "https://manhattan-host.veoride.com:8444/api"

export const ACCESS_TOKEN = "accessToken";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
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

  /* return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    }); */
}
