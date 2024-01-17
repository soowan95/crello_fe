import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import emailjs from "@emailjs/browser";
import PurchasePage from "./PurchasePage";

function WelcomePage() {
  const [firstEmail, setFirstEmail] = useState(null);
  const [secondEmail, setSecondEmail] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [password, setPassword] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);
  const [emailValidate, setEmailValidate] = useState(false);
  const [securityCode, setSecurityCode] = useState(null);
  const [checkSecurityCode, setCheckSecurityCode] = useState(null);

  const secondEmailValue = useRef(null);

  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) navigate("/u/board");
  }, [navigate]);

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
    <Box>
      <Outlet />
      <Flex
        mt={"10px"}
        w={"100%"}
        h={"600px"}
        justifyContent={"center"}
        gap={"50px"}
      >
        <Box w={"450px"} h={"100%"}>
          <Heading mt={"50px"} lineHeight={"60px"}>
            Crello brings all your tasks, teammates, and tools together
          </Heading>
          <Text mt={"20px"}>
            Clone coding for trello.
            <Badge cursor={"pointer"} bg={"none"} color={"#9a9a9a"}>
              <Link to={"https://trello.com/home"}>go to Trello.</Link>
            </Badge>
          </Text>
          {!emailValidate && !securityCode && (
            <Flex mt={"30px"} alignItems={"center"}>
              <Input
                w={"30%"}
                mr={"3px"}
                placeholder={"Email"}
                onChange={(e) => setFirstEmail(e.target.value)}
              />
              @
              <Input
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
            <Input
              mt={"20px"}
              value={firstEmail + "@" + secondEmail}
              readOnly
            />
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
              onChange={(e) => setNickname(e.target.value)}
            />
          )}
          {emailValidate && (
            <Button
              mt={"20px"}
              onClick={handleSubmit}
              isDisabled={!password || password !== checkPassword}
            >
              Sign-up for Free
            </Button>
          )}
        </Box>
        <Box w={"450px"} h={"100%"}>
          <Image
            mt={"60px"}
            src={`${process.env.PUBLIC_URL}/img/todoIcon.png`}
          />
        </Box>
      </Flex>
      <PurchasePage />
    </Box>
  );
}

export default WelcomePage;
