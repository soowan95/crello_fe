import { Box, Flex, Heading } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Board({ boards, recentBoard }) {
  const navigate = useNavigate();

  const handleBoard = (id, title) => {
    axios
      .put(
        "/api/v1/board/updateRecent",
        {
          id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        },
      )
      .then(() => {
        localStorage.setItem("boardId", id);
        localStorage.setItem("boardTitle", title);
        navigate("/u/list");
      });
  };

  return (
    <Box>
      <Box w={"90%"} m={"80px auto"}>
        <Box h={"50px"} fontSize={"1.5rem"}>
          <FontAwesomeIcon icon={faClock} /> Recently worked
        </Box>
        <Box
          mt={"20px"}
          pl={3}
          w={"230px"}
          h={"200px"}
          bg={"#1d285d"}
          borderRadius={"10px"}
          lineHeight={"40px"}
          fontSize={"1.2rem"}
          onClick={() => handleBoard(recentBoard.id, recentBoard.title)}
        >
          {recentBoard !== null && recentBoard.title}
        </Box>
      </Box>
      <Box w={"90%"} m={"80px auto"}>
        <Heading h={"80px"}>Your Workspaces</Heading>
        <Flex w={"100%"} h={"200px"} gap={"6%"}>
          {boards.length !== 0 &&
            boards.map((board, idx) => (
              <Box
                pl={3}
                key={idx}
                w={"230px"}
                h={"100%"}
                bg={"#1d285d"}
                borderRadius={"10px"}
                lineHeight={"40px"}
                fontSize={"1.2rem"}
                onClick={() => handleBoard(board.id, board.title)}
              >
                {board !== null && board.title}
              </Box>
            ))}
        </Flex>
      </Box>
    </Box>
  );
}

export default Board;
