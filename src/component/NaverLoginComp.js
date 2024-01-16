import { useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faN } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NaverLoginComp() {
  const navigate = useNavigate();

  useEffect(() => {
    let naverLogin = new window.naver.LoginWithNaverId({
      clientId: `${process.env.REACT_APP_NAVER_CLIENT_ID}`,
      callbackUrl: `${process.env.REACT_APP_NAVER_REDIRECT_URI}`,
      isPopup: false,
      loginButton: { color: "green", type: 3 },
    });

    naverLogin.init();
    naverLogin.logout();

    try {
      naverLogin.getLoginStatus((status) => {
        if (status) {
          axios
            .get("/api/v1/user/check?email=" + naverLogin.user.email)
            .then(() => {
              localStorage.setItem("oauthEmail", naverLogin.user.email);
              localStorage.setItem("oauthNickname", naverLogin.user.nickname);
              localStorage.setItem("oauthPhoto", naverLogin.user.profile_image);
              navigate("/login");
            })
            .catch(() => {
              axios
                .post("/oauthLogin", {
                  email: naverLogin.user.email,
                })
                .then(({ data }) => {
                  localStorage.setItem("accessToken", data.accessToken);
                  localStorage.setItem("refreshToken", data.refreshToken);
                  localStorage.setItem("nickname", data.nickname);
                  localStorage.setItem("email", data.email);
                  localStorage.setItem("photo", data.photo);
                  navigate("/u/board");
                });
            });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div>
      <div id={"naverIdLogin"} style={{ display: "none" }} />
      <Button
        onClick={() =>
          document.getElementById("naverIdLogin_loginButton").click()
        }
        mt={"20px"}
        w={"100%"}
        colorScheme={"green"}
        gap={5}
      >
        <FontAwesomeIcon icon={faN} />
        네이버 로그인
      </Button>
    </div>
  );
}

export default NaverLoginComp;
