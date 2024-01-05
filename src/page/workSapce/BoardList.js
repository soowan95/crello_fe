import { Box, Flex, Heading } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

function BoardList({ boards }) {
  return (
    <Box>
      <Box w={"90%"} h={"150px"} m={"50px auto"}>
        <Box h={"30px"}>
          <FontAwesomeIcon icon={faClock} /> Recently worked
        </Box>
        <Flex w={"100%"} h={"120px"}>
          {boards.length !== 0 &&
            boards.map((board, idx) => (
              <Box
                pl={3}
                key={idx}
                w={"20%"}
                h={"120px"}
                bg={"#1d285d"}
                borderRadius={"10px"}
                lineHeight={"40px"}
              >
                board
              </Box>
            ))}
        </Flex>
      </Box>
      <Box w={"90%"} h={"200px"} m={"80px auto"}>
        <Heading h={"80px"}>Your Workspaces</Heading>
        <Flex w={"100%"} h={"120px"} gap={"6%"}>
          {boards.length !== 0 &&
            boards.map((board, idx) => (
              <Box
                pl={3}
                key={idx}
                w={"20%"}
                h={"120px"}
                bg={"#1d285d"}
                borderRadius={"10px"}
                lineHeight={"40px"}
              >
                board
              </Box>
            ))}
        </Flex>
      </Box>
    </Box>
  );
}

export default BoardList;
