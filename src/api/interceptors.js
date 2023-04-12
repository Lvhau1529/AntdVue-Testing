import { getToken, removeToken } from "src/helper/auth";

function configRequest(instance) {
  instance?.interceptors?.request?.use(
    function (config) {
      const token = getToken();
      if (token) {
        config.headers = Object.assign(config.headers, {
          Authorization: token,
        });
      }
      return config;
    },
    function (err) {
      console.log("err", JSON.stringify(err));
      return Promise.reject(JSON.parse(JSON.stringify(err)));
    }
  );
}

function configResponse(instance) {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        if (
          (error.response.status === 401 || error.response.status === 403) &&
          !window.location.pathname.includes("login")
        ) {
          removeToken();
        }
        return {
          data: error?.response?.data,
          status: error?.response?.status,
        };
      }
    }
  );
}

export default {
  configRequest,
  configResponse,
};
