import {
  Box,
  Flex,
  Heading,
  Switch,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { instance } from "../../modules/axios_interceptor";
import React from "react";

function Board({ boards, recentBoard }) {
  const toast = useToast();

  const navigate = useNavigate();

  const params = useParams();

  const handleBoard = (id, title) => {
    if (params.code === localStorage.getItem("code")) {
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
          navigate(`/u/list/${localStorage.getItem("code")}`);
        });
    } else {
      localStorage.setItem("boardId", id);
      localStorage.setItem("boardTitle", title);
      localStorage.setItem(
        "boardColor",
        boards.filter((b) => b.id - id === 0).at(0).color,
      );
      navigate(`/u/list/${params.code}`);
    }
  };

  const handleBoardPublic = (id, isPublic) => {
    instance
      .put("/api/v1/board/updatePublic", {
        id,
        isPublic: !isPublic,
      })
      .catch((err) => {
        toast({
          description: err.response.data.msg,
          status: "error",
        });
      });
  };

  return (
    <Box>
      <Box w={"90%"} m={"80px auto"}>
        {params.code === localStorage.getItem("code") && (
          <Box h={"50px"} fontSize={"1.5rem"}>
            <FontAwesomeIcon icon={faClock} /> Recently worked
          </Box>
        )}
        {params.code === localStorage.getItem("code") &&
          recentBoard !== null &&
          recentBoard !== "" && (
            <Box
              mt={"20px"}
              pl={3}
              w={"230px"}
              h={"200px"}
              bg={recentBoard.color}
              borderRadius={"10px"}
              lineHeight={"40px"}
              fontSize={"1.2rem"}
              cursor={"pointer"}
              onClick={() => handleBoard(recentBoard.id, recentBoard.title)}
            >
              {recentBoard.title}
            </Box>
          )}
      </Box>
      <Box w={"90%"} m={"80px auto"}>
        <Heading h={"80px"}>
          {params.code === localStorage.getItem("code") && "Your"} Workspaces
        </Heading>
        <Flex w={"fit-content"} h={"200px"} gap={10}>
          {params.code === localStorage.getItem("code") &&
            boards.length !== 0 &&
            boards.map((board, idx) => (
              <Box key={idx} position={"relative"}>
                <Box
                  pl={3}
                  w={"230px"}
                  h={"100%"}
                  bg={board.color}
                  borderRadius={"10px"}
                  lineHeight={"40px"}
                  fontSize={"1.2rem"}
                  cursor={"pointer"}
                  onClick={() => handleBoard(board.id, board.title)}
                >
                  {board.title}
                </Box>
                <Tooltip
                  hasArrow
                  placement={"top"}
                  label={"Make public or not"}
                >
                  <Box position={"absolute"} bottom={"5px"} right={"20px"}>
                    <Switch
                      defaultChecked={board.isPublic}
                      onChange={() =>
                        handleBoardPublic(board.id, board.isPublic)
                      }
                      size={"sm"}
                    />
                  </Box>
                </Tooltip>
              </Box>
            ))}
          {params.code !== localStorage.getItem("code") &&
            boards.length !== 0 &&
            boards
              .filter((board) => board.isPublic)
              .map((board, idx) => (
                <Box
                  pl={3}
                  key={idx}
                  w={"230px"}
                  h={"100%"}
                  bg={board.color}
                  borderRadius={"10px"}
                  lineHeight={"40px"}
                  fontSize={"1.2rem"}
                  cursor={"pointer"}
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
