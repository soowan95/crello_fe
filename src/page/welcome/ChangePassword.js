import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { instance } from "../../modules/axios_interceptor";

function ChangePassword() {
  const [email, setEmail] = useState(null);
  const [securityCode, setSecurityCode] = useState(null);
  const [emailValidate, setEmailValidate] = useState(false);
  const [checkSecurityCode, setCheckSecurityCode] = useState(null);
  const [password, setPassword] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);

  const toast = useToast();

  const navigate = useNavigate();

  const handleSendSecurityCode = (e) => {
    e.preventDefault();

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += Math.ceil(Math.random() * 10);
    }

    axios
      .get("/api/v1/user/check?email=" + email)
      .then(() => {
        toast({
          description: "해당 이메일이 존재하지 않습니다.",
          status: "error",
        });
      })
      .catch(() => {
        emailjs
          .send(
            `${process.env.REACT_APP_EMAILJS_SERVICEID}`,
            `${process.env.REACT_APP_EMAILJS_CHANGEPW_TEMPLATEID}`,
            { securityCode: code, userEmail: email },
            `${process.env.REACT_APP_EMAILJS_PUBLICKEY}`,
          )
          .then(() => setSecurityCode(code))
          .catch(() => {
            toast({
              position: "top",
              description: "Please input the correct email form",
              status: "warning",
            });
          });
      });
  };

  const handleVarify = () => {
    if (securityCode === checkSecurityCode) setEmailValidate(true);
    console.log(securityCode);
    console.log(checkSecurityCode);
  };

  const handleChange = () => {
    axios
      .put("/api/v1/user/changepw", {
        email: email,
        password: password,
      })
      .then(() => navigate("/login"))
      .catch((err) => {
        toast({
          description: err.response.data.msg,
          status: "error",
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
      <Box w={"100%"} h={"30px"} lineHeight={"30px"} textAlign={"center"}>
        Change your password.
      </Box>
      {!emailValidate && !securityCode && (
        <Input
          mt={"30px"}
          placeholder={"Email"}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}
      {!securityCode && (
        <Button
          mt={"10px"}
          w={"100%"}
          isDisabled={!email}
          onClick={handleSendSecurityCode}
        >
          Send securityCode
        </Button>
      )}
      {securityCode && !emailValidate && (
        <Input
          mt={"20px"}
          placeholder={"Input securityCode"}
          onChange={(e) => setCheckSecurityCode(e.target.value)}
        />
      )}
      {securityCode && !emailValidate && (
        <Button
          mt={"20px"}
          onClick={handleVarify}
          isDisabled={!checkSecurityCode}
        >
          Verify email
        </Button>
      )}
      {emailValidate && (
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
      {emailValidate && (
        <Button
          mt={"20px"}
          onClick={handleChange}
          isDisabled={!password || password !== checkPassword}
        >
          Change
        </Button>
      )}
    </Box>
  );
}

export default ChangePassword;
