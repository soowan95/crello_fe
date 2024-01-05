import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navbar() {
  const navigate = useNavigate();

  return (
    <Flex
      w={{ lg: "100%", xl: "70%" }}
      h={"50px"}
      m={"0 auto"}
      borderBottom={"1px solid white"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Box
        mr={"70%"}
        h={"100%"}
        w={"10%"}
        cursor={"pointer"}
        fontSize={"1.5rem"}
        textAlign={"center"}
        lineHeight={"50px"}
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon={faChartSimple} /> Crello
      </Box>

      <Box
        w={"10%"}
        h={"100%"}
        textAlign={"center"}
        lineHeight={"50px"}
        onClick={() => navigate("/login")}
      >
        Sign In
      </Box>
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
    </Flex>
  );
}

export default Navbar;
