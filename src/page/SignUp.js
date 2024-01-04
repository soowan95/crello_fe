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
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [firstEmail, setFirstEmail] = useState(null);
  const [secondEmail, setSecondEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);
  const [nickname, setNickname] = useState(null);

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
            navigate("/u");
          });
      })
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
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon={faChartSimple} /> Crello
      </Heading>
      <Box w={"100%"} h={"30px"} lineHeight={"30px"} textAlign={"center"}>
        Sign up for free.
      </Box>
      <Box>
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
            w={"50%"}
            ml={"3px"}
            placeholder={"Write your email address"}
            defaultValue={secondEmail}
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
                onClick={(e) => setSecondEmail(e.target.value)}
              >
                gmail.com
              </MenuItem>
              <MenuItem
                value={"naver.com"}
                onClick={(e) => setSecondEmail(e.target.value)}
              >
                naver.com
              </MenuItem>
              <MenuItem
                value={"hanmail.net"}
                onClick={(e) => setSecondEmail(e.target.value)}
              >
                hanmail.net
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <FormControl isInvalid={password !== checkPassword}>
          <Input
            id={"password"}
            mt={"15px"}
            type={"password"}
            placeholder={"Password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id={"checkPassword"}
            mt={"15px"}
            type={"password"}
            placeholder={"CheckPassword"}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          <FormErrorMessage>Check your password.</FormErrorMessage>
        </FormControl>
        <Input
          id={"name"}
          mt={"15px"}
          placeholder={
            firstEmail ? "Nickname ( " + firstEmail + " )" : "Nickname"
          }
          onChange={(e) => setNickname(e.target.value)}
        />
        <Button
          mt={"20px"}
          onClick={handleSubmit}
          isDisabled={!password || password !== checkPassword}
        >
          Sign-up
        </Button>
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
