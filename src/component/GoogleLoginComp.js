import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GoogleLoginComp() {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      console.log(res);
      axios
        .get("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: "Bearer " + res.access_token,
          },
        })
        .then(({ data }) => {
          axios
            .get("/api/v1/user/check?email=" + data.email)
            .then(() => {
              localStorage.setItem("oauthEmail", data.email);
              localStorage.setItem("oauthNickname", data.name);
              localStorage.setItem("oauthPhoto", data.picture);
              navigate("/login");
            })
            .catch(() => {
              axios
                .post("/oauthLogin", {
                  email: data.email,
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
    },
  });

  return (
    <Button
      onClick={() => googleLogin()}
      mt={"20px"}
      w={"100%"}
      colorScheme={"blue"}
      gap={5}
    >
      <FontAwesomeIcon icon={faGoogle} />
      구글 로그인
    </Button>
  );
}

export default GoogleLoginComp;
