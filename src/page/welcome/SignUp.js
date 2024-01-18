import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faChevronDown,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import PaymentComp from "../../component/PaymentComp";

function SignUp() {
  const [firstEmail, setFirstEmail] = useState(null);
  const [secondEmail, setSecondEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [emailValidate, setEmailValidate] = useState(false);
  const [securityCode, setSecurityCode] = useState(null);
  const [checkSecurityCode, setCheckSecurityCode] = useState(null);

  const secondEmailValue = useRef();

  const toast = useToast();

  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("/api/v1/user/regist", {
        nickname,
        email: firstEmail + "@" + secondEmail,
        password,
      })
      .then(() => {
        axios
          .post("/login", {
            email: firstEmail + "@" + secondEmail,
            password,
          })
          .then(({ data }) => {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("nickname", data.nickname);
            localStorage.setItem("email", data.email);
            localStorage.setItem("photo", data.photo);
            localStorage.setItem("role", data.role);
            navigate("/u/board");
          });
      })
      .catch((err) => {
        toast({
          description: err.response.data.msg,
          status: "error",
        });
      });
  };

  const handleSendSecurityCode = (e) => {
    e.preventDefault();

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += Math.ceil(Math.random() * 10);
    }

    axios
      .get("/api/v1/user/check?email=" + firstEmail + "@" + secondEmail)
      .then(() => {
        emailjs
          .send(
            `${process.env.REACT_APP_EMAILJS_SERVICEID}`,
            `${process.env.REACT_APP_EMAILJS_SIGNUP_TEMPLATEID}`,
            { securityCode: code, userEmail: firstEmail + "@" + secondEmail },
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
      })
      .catch((err) => {
        toast({
          description: err.response.data.msg,
          status: "error",
        });
      });
  };

  const handleVarify = () => {
    if (securityCode === checkSecurityCode) setEmailValidate(true);
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
        Sign up for free.
      </Box>
      <Box>
        {!emailValidate && !securityCode && (
          <Flex mt={"30px"} alignItems={"center"}>
            <Input
              id={"firstEmail"}
              w={"30%"}
              mr={"3px"}
              placeholder={"Email"}
              onChange={(e) => setFirstEmail(e.target.value)}
            />
            @
            <Input
              if={"secondEmail"}
              ref={secondEmailValue}
              w={"50%"}
              ml={"3px"}
              placeholder={"Write your email address"}
              defaultValue={secondEmail}
              onChange={(e) => setSecondEmail(e.target.value)}
            />
            <Menu>
              <MenuButton
                as={Button}
                p={1}
                fontSize={"1rem"}
                rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
              >
                select
              </MenuButton>
              <MenuList>
                <MenuItem
                  value={"gmail.com"}
                  onClick={(e) => {
                    setSecondEmail(e.target.value);
                    secondEmailValue.current.value = e.target.value;
                  }}
                >
                  gmail.com
                </MenuItem>
                <MenuItem
                  value={"naver.com"}
                  onClick={(e) => {
                    setSecondEmail(e.target.value);
                    secondEmailValue.current.value = e.target.value;
                  }}
                >
                  naver.com
                </MenuItem>
                <MenuItem
                  value={"hanmail.net"}
                  onClick={(e) => {
                    setSecondEmail(e.target.value);
                    secondEmailValue.current.value = e.target.value;
                  }}
                >
                  hanmail.net
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}
        {securityCode && (
          <Input mt={"20px"} value={firstEmail + "@" + secondEmail} readOnly />
        )}
        {!securityCode && (
          <Button
            mt={"20px"}
            onClick={handleSendSecurityCode}
            isDisabled={!firstEmail || !secondEmail}
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
          <Input
            id={"name"}
            mt={"15px"}
            placeholder={
              firstEmail ? "Nickname ( " + firstEmail + " )" : "Nickname"
            }
            onChange={(e) => {
              e.target.value = e.target.value.replace(" ", "");
              setNickname(e.target.value);
            }}
          />
        )}
        {emailValidate && (
          <Button
            mt={"20px"}
            onClick={() => {
              handleSubmit();
              if (localStorage.getItem("purchase"))
                document.getElementById("payment").click();
            }}
            isDisabled={!password || password !== checkPassword}
          >
            Sign-up
          </Button>
        )}
        <Box display={"none"}>
          <PaymentComp
            amount={localStorage.getItem("amount")}
            role={localStorage.getItem("purchase")}
          />
        </Box>
        <Flex mt={"20px"} w={"100%"} h={"30px"} justifyContent={"center"}>
          <Badge bg={"none"}>do you have accont ?</Badge>
          <Box mx={"3px"} h={"100%"} lineHeight={"20px"} fontSize={"0.2rem"}>
            <FontAwesomeIcon icon={faCircle} />
          </Box>
          <Badge
            bg={"none"}
            onClick={() => navigate("/login")}
            cursor={"pointer"}
          >
            sign in
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
}

export default SignUp;
