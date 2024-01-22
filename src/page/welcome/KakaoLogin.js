import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function KakaoLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const KAKAO_CODE = location.search.split("=")[1];

  const getKakaoToken = () => {
    fetch(`https://kauth.kakao.com/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&code=${KAKAO_CODE}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          fetch(`https://kapi.kakao.com/v2/user/me`, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + data.access_token,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              axios
                .get("/api/v1/user/check?email=" + data.kakao_account.email)
                .then(() => {
                  localStorage.setItem("oauthEmail", data.kakao_account.email);
                  localStorage.setItem(
                    "oauthNickname",
                    data.kakao_account.profile.nickname,
                  );
                  localStorage.setItem(
                    "oauthPhoto",
                    data.kakao_account.profile.profile_image_url,
                  );
                  navigate("/login");
                })
                .catch(() => {
                  axios
                    .post("/api/v1/auth/oauthLogin", {
                      email: data.kakao_account.email,
                    })
                    .then(({ data }) => {
                      localStorage.setItem("accessToken", data.accessToken);
                      localStorage.setItem("refreshToken", data.refreshToken);
                      localStorage.setItem("nickname", data.nickname);
                      localStorage.setItem("email", data.email);
                      localStorage.setItem("photo", data.photo);
                      localStorage.setItem("role", data.role);
                      localStorage.setItem("code", data.code);
                      navigate(`/u/board/${data.code}`);
                    });
                });
            });
        }
      });
  };

  useEffect(() => {
    if (!location.search) return;
    getKakaoToken();
  }, []);

  return <div></div>;
}

export default KakaoLogin;
