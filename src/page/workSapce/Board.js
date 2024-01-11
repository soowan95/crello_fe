import { Box, Flex, Heading } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { instance } from "../../modules/axios_interceptor";

function Board({ boards, recentBoard }) {
  const navigate = useNavigate();

  console.log(recentBoard);

  const handleBoard = (id, title) => {
    instance
      .put("/api/v1/board/updateRecent", {
        id,
      })
      .then(() => {
        localStorage.setItem("boardId", id);
        localStorage.setItem("boardTitle", title);
        localStorage.setItem(
          "boardColor",
          boards.filter((b) => b.id - id === 0).at(0).color,
        );
        navigate("/u/list");
      });
  };

  return (
    <Box>
      <Box w={"90%"} m={"80px auto"}>
        <Box h={"50px"} fontSize={"1.5rem"}>
          <FontAwesomeIcon icon={faClock} /> Recently worked
        </Box>
        {recentBoard !== null && recentBoard !== "" && (
          <Box
            mt={"20px"}
            pl={3}
            w={"230px"}
            h={"200px"}
            bg={recentBoard.color}
            borderRadius={"10px"}
            lineHeight={"40px"}
            fontSize={"1.2rem"}
            onClick={() => handleBoard(recentBoard.id, recentBoard.title)}
          >
            {recentBoard.title}
          </Box>
        )}
      </Box>
      <Box w={"90%"} m={"80px auto"}>
        <Heading h={"80px"}>Your Workspaces</Heading>
        <Flex w={"fit-content"} h={"200px"} gap={10}>
          {boards.length !== 0 &&
            boards.map((board, idx) => (
              <Box
                pl={3}
                key={idx}
                w={"230px"}
                h={"100%"}
                bg={board.color}
                borderRadius={"10px"}
                lineHeight={"40px"}
                fontSize={"1.2rem"}
                onClick={() => handleBoard(board.id, board.title)}
              >
                {board.title}
              </Box>
            ))}
        </Flex>
      </Box>
    </Box>
  );
}

export default Board;
