import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

function WorkSpacePage() {
  const [boardTitle, setBoardTitle] = useState(null);
  const [boards, setBoards] = useState([]);
  const [recentBoard, setRecentBoard] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    handleBoards();
  }, [boards.length, navigate]);

  const handleRecentBoeard = () => {
    axios.get("/api/v1/board/recent?email=" + localStorage.getItem("email"), {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  };

  const handleBoards = () => {
    axios
      .get("/api/v1/board/all?email=" + localStorage.getItem("email"), {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then(({ data }) => setBoards(data.title))
      .catch((err) => {
        if (err.response.status === 401) navigate("/login");
      });
  };

  const handleCreate = () => {
    axios
      .post(
        "/api/v1/board/create",
        {
          title: boardTitle,
          email: localStorage.getItem("email"),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        },
      )
      .then(() => handleBoards())
      .catch(() => navigate("/login"));
  };

  return (
    <Box>
      <Flex
        w={{ lg: "100%", xl: "70%" }}
        h={"40px"}
        m={"0 auto"}
        borderBottom={"1px solid white"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box
          h={"100%"}
          w={"10%"}
          cursor={"pointer"}
          fontSize={"1.2rem"}
          textAlign={"center"}
          lineHeight={"40px"}
          onClick={() => navigate("/")}
        >
          <FontAwesomeIcon icon={faChartSimple} /> Crello
        </Box>

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
                localStorage.removeItem("nickname");
                localStorage.removeItem("email");
                navigate("/");
              }}
            >
              logout
            </Button>
          </PopoverContent>
        </Popover>
      </Flex>
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

export default WorkSpacePage;
