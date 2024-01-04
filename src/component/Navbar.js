import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navbar() {
  const navigate = useNavigate();

  const location = useLocation();

  console.log(location.pathname);

  return (
    <Flex
      w={{ lg: "100%", xl: "70%" }}
      h={location.pathname === "/" ? "50px" : "40px"}
      m={"0 auto"}
      borderBottom={"1px solid white"}
      justifyContent={"space-between"}
    >
      <Box
        mr={"70%"}
        h={"100%"}
        w={"10%"}
        cursor={"pointer"}
        fontSize={location.pathname === "/" ? "1.5rem" : "1.2rem"}
        textAlign={"center"}
        lineHeight={location.pathname === "/" ? "50px" : "40px"}
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon={faChartSimple} /> Crello
      </Box>
      {location.pathname === "/" && (
        <Box
          w={"10%"}
          h={"100%"}
          textAlign={"center"}
          lineHeight={"50px"}
          onClick={() => navigate("/login")}
        >
          Sign In
        </Box>
      )}
      {location.pathname === "/" && (
        <Box
          w={"10%"}
          h={"100%"}
          textAlign={"center"}
          lineHeight={"50px"}
          bg={"white"}
          color={"rgb(26,32,44)"}
          fontWeight={"bold"}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Box>
      )}
      {location.pathname.includes("/u") && (
        <Popover placement={"bottom"}>
          <PopoverTrigger>
            <Center>
              <Avatar size={"sm"} name={"k"} />
            </Center>
          </PopoverTrigger>
          <PopoverContent w={"100px"}>
            <Button
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                navigate("/");
              }}
            >
              logout
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </Flex>
  );
}

export default Navbar;
