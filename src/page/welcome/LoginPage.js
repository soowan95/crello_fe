import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import KakaoLoginComp from "../../component/KakaoLoginComp";
import GoogleLoginComp from "../../component/GoogleLoginComp";
import NaverLoginComp from "../../component/NaverLoginComp";

function LoginPage() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [forgetPw, setForgetPw] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    setEmail(localStorage.getItem("oauthEmail"));
  }, []);

  const handleSubmit = () => {
    axios
      .post("/api/v1/auth/login", {
        email: email === null ? localStorage.getItem("oauthEmail") : email,
        password,
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
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            description: err.response.data.msg,
            status: "error",
          });
        } else if (err.response.status === 403) {
          toast({
            description: "비밀번호가 일치하지 않습니다.",
            status: "error",
          });
          setAttempt((attempt) => attempt + 1);
        }
        if (attempt === 4) {
          setAttempt(0);
          setForgetPw(true);
        }
      });
  };

  const handleOauthSubmit = () => {
    axios
      .post("/api/v1/user/regist", {
        email: localStorage.getItem("oauthEmail"),
        nickname: localStorage.getItem("oauthNickname"),
        password: password,
        photo: localStorage.getItem("oauthPhoto"),
      })
      .then(() => {
        handleSubmit();
        localStorage.removeItem("oauthNickname");
        localStorage.removeItem("oauthPhoto");
        localStorage.removeItem("oauthEmail");
      })
      .catch(() => {
        toast({
          description: "등록 중 문제가 발생했습니다.",
          status: "warning",
        });
      });
  };

  return (
    <Box w={"350px"} h={"700px"} m={"100px auto"}>
      <Heading
        w={"100%"}
        h={"100px"}
        lineHeight={"100px"}
        textAlign={"center"}
        cursor={"pointer"}
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon={faChartSimple} /> Crello
      </Heading>
      {!localStorage.getItem("oauthEmail") && (
        <Box w={"100%"} h={"30px"} lineHeight={"30px"} textAlign={"center"}>
          Sign in to continue.
        </Box>
      )}
      {localStorage.getItem("oauthEmail") && (
        <Box w={"100%"} h={"30px"} lineHeight={"30px"} textAlign={"center"}>
          Input password for this site.
        </Box>
      )}
      {!localStorage.getItem("oauthEmail") && (
        <Input
          mt={"30px"}
          placeholder={"Email"}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}
      {!localStorage.getItem("oauthEmail") && (
        <Input
          mt={"10px"}
          type={"password"}
          placeholder={"Password"}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}
      {localStorage.getItem("oauthEmail") && (
        <FormControl isInvalid={password !== checkPassword}>
          <Input
            mt={"15px"}
            type={"password"}
            placeholder={"Password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            mt={"15px"}
            type={"password"}
            placeholder={"CheckPassword"}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          <FormErrorMessage>Check your password.</FormErrorMessage>
        </FormControl>
      )}
      {!localStorage.getItem("oauthEmail") && (
        <Button
          mt={"10px"}
          w={"100%"}
          isDisabled={!email || !password}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      )}
      {localStorage.getItem("oauthEmail") && (
        <Button
          mt={"10px"}
          w={"100%"}
          isDisabled={!password || password !== checkPassword}
          onClick={handleOauthSubmit}
        >
          Continue
        </Button>
      )}
      {forgetPw && (
        <Flex
          mt={"20px"}
          mb={"-20px"}
          w={"100%"}
          h={"30px"}
          justifyContent={"center"}
        >
          <Badge bg={"none"}>Forget your password ?</Badge>
          <Box mx={"3px"} h={"100%"} lineHeight={"20px"} fontSize={"0.2rem"}>
            <FontAwesomeIcon icon={faCircle} />
          </Box>
          <Badge
            bg={"none"}
            onClick={() => {
              navigate("/cpw");
              setForgetPw(false);
              localStorage.setItem("ownEmail", email);
            }}
            cursor={"pointer"}
          >
            change password
          </Badge>
        </Flex>
      )}
      <Flex mt={"20px"} w={"100%"} h={"30px"} justifyContent={"center"}>
        <Badge bg={"none"}>dont't you have accont ?</Badge>
        <Box mx={"3px"} h={"100%"} lineHeight={"20px"} fontSize={"0.2rem"}>
          <FontAwesomeIcon icon={faCircle} />
        </Box>
        <Badge
          bg={"none"}
          onClick={() => navigate("/signup")}
          cursor={"pointer"}
        >
          create account
        </Badge>
      </Flex>
      {!localStorage.getItem("oauthEmail") && <Divider />}
      {!localStorage.getItem("oauthEmail") && (
        <Badge ml={"60px"} mt={"10px"} bg={"none"}>
          Or continue using something else
        </Badge>
      )}
      {!localStorage.getItem("oauthEmail") && <KakaoLoginComp />}
      {!localStorage.getItem("oauthEmail") && <GoogleLoginComp />}
      {!localStorage.getItem("oauthEmail") && <NaverLoginComp />}
    </Box>
  );
}

export default LoginPage;
