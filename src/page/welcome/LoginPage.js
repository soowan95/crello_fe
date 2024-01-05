import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const toast = useToast();

  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("/login", {
        email,
        password,
      })
      .then(({ data }) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("nickname", data.nickname);
        localStorage.setItem("email", data.email);
        navigate("/u/boardList");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast({
            description: "로그인 정보가 일지하지 않습니다.",
            status: "error",
          });
        }
      });
  };

  return (
    <Box w={"350px"} h={"700px"} m={"100px auto"}>
      <Heading
        w={"100%"}
        h={"100px"}
        lineHeight={"100px"}
        textAlign={"center"}
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon={faChartSimple} /> Crello
      </Heading>
      <Box w={"100%"} h={"30px"} lineHeight={"30px"} textAlign={"center"}>
        Sign in to continue.
      </Box>
      <Input
        mt={"30px"}
        placeholder={"Email"}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        mt={"10px"}
        type={"password"}
        placeholder={"Password"}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        mt={"10px"}
        w={"100%"}
        isDisabled={!email || !password}
        onClick={handleSubmit}
      >
        Continue
      </Button>
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
    </Box>
  );
}

export default LoginPage;
