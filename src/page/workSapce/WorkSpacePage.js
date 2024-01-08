import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import Board from "./Board";
import List from "./List";
import { instance } from "../../modules/axios_interceptor";

function WorkSpacePage() {
  const [boardTitle, setBoardTitle] = useState(null);
  const [boards, setBoards] = useState([]);
  const [recentBoard, setRecentBoard] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) navigate("/login");
    else if (location.pathname === "/u/board") {
      handleBoards();
      handleRecentBoeard();
    }
  }, [location]);

  const handleRecentBoeard = () => {
    instance
      .get("/api/v1/board/recent?email=" + localStorage.getItem("email"))
      .then(({ data }) => setRecentBoard(data));
  };

  const handleBoards = () => {
    instance
      .get("/api/v1/board/all?email=" + localStorage.getItem("email"))
      .then(({ data }) => setBoards(data));
  };

  const handleCreate = () => {
    instance
      .post("/api/v1/board/create", {
        title: boardTitle,
        email: localStorage.getItem("email"),
      })
      .then(() => handleBoards());
  };

  return (
    <Box position={"relative"}>
      <Flex
        w={{ lg: "100%", xl: "70%" }}
        h={"40px"}
        m={"0 auto"}
        borderBottom={"1px solid white"}
        alignItems={"center"}
        justifyContent={"space-between"}
        position={"fixed"}
        top={0}
        left={{ lg: "0", xl: "15%" }}
      >
        <Box
          h={"100%"}
          w={"10%"}
          cursor={"pointer"}
          fontSize={"1.2rem"}
          textAlign={"center"}
          lineHeight={"40px"}
          onClick={() => navigate("/u/board")}
        >
          <FontAwesomeIcon icon={faChartSimple} /> Crello
        </Box>
        {location.pathname === "/u/board" && (
          <Popover placement={"bottom-start"}>
            <PopoverTrigger>
              <Button mr={"75%"} w={"8%"} size={"sm"}>
                Create
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Box m={"5px auto"}>Create board</Box>
              <PopoverCloseButton />
              <FormControl isInvalid={!boardTitle}>
                <FormLabel fontSize={"0.8rem"} ml={4}>
                  Board Title
                </FormLabel>
                <Input
                  w={"90%"}
                  ml={4}
                  onChange={(e) => setBoardTitle(e.target.value)}
                />
                <FormErrorMessage ml={4}>
                  * Board title is required
                </FormErrorMessage>
              </FormControl>
              <Button
                w={"90%"}
                m={"10px auto"}
                isDisabled={!boardTitle}
                onClick={handleCreate}
              >
                Create
              </Button>
            </PopoverContent>
          </Popover>
        )}
        <Popover placement={"bottom"}>
          <PopoverTrigger>
            <Center>
              <Avatar
                mr={"10px"}
                size={"sm"}
                name={localStorage.getItem("nickname")}
              />
            </Center>
          </PopoverTrigger>
          <PopoverContent w={"100px"}>
            <Button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              logout
            </Button>
          </PopoverContent>
        </Popover>
      </Flex>
      {location.pathname === "/u/board" && (
        <Board boards={boards} recentBoard={recentBoard} />
      )}
      {location.pathname === "/u/list" && <List boards={boards} />}
    </Box>
  );
}

export default WorkSpacePage;
