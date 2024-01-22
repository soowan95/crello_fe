import axios from "axios";

const baseURL = "http://43.200.39.112:8081";

export const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(
  (request) => {
    request.headers.Authorization =
      "Bearer " + localStorage.getItem("accessToken");
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;

    if (response.status === 401 && response.data.msg === "만료된 JWT 토큰") {
      try {
        const { data } = await axios.post(
          "/api/v1/auth/refresh",
          {
            email: localStorage.getItem("email"),
            refreshToken: localStorage.getItem("refreshToken"),
          },
          {
            baseURL: baseURL,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("refreshToken"),
            },
          },
        );

        const { accessToken } = data;
        localStorage.setItem("accessToken", accessToken);
        config.headers.Authorization = "Bearer " + accessToken;
        return axios(config);
      } catch (refreshError) {
        await axios.post(
          "/api/v1/auth/logout",
          { email: localStorage.getItem("email") },
          {
            baseURL: baseURL,
          },
        );
        window.location.href = "/login";
        localStorage.clear();
      }
    } else if (response.status === 403 && !response.data.msg) {
      window.location.href = "/";
      localStorage.clear();
    }
    return Promise.reject(error);
  },
);
