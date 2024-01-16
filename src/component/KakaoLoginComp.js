import { Button } from "@chakra-ui/react";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function KakaoLoginComp() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Button
      mt={"20px"}
      w={"100%"}
      colorScheme="yellow"
      onClick={handleLogin}
      gap={5}
    >
      <FontAwesomeIcon icon={faComment} />
      카카오 로그인
    </Button>
  );
}

export default KakaoLoginComp;
