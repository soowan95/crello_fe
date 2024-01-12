import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Board from "./Board";
import List from "./List";
import { instance } from "../../modules/axios_interceptor";
import ManageAccount from "./ManageAccount";

function WorkSpacePage() {
  const [boardTitle, setBoardTitle] = useState(null);
  const [boards, setBoards] = useState([]);
  const [recentBoard, setRecentBoard] = useState(null);
  const [color, setColor] = useState("#1d285d");

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
        color: color,
      })
      .then(() => handleBoards());
  };

  const handleLogout = () => {
    instance
      .post("/logout", { email: localStorage.getItem("email") })
      .then(() => {
        localStorage.clear();
        navigate("/");
      });
  };

  return (
    <Box position={"relative"} style={{ body: { backgroud: "pink" } }}>
      <Flex
        w={{ base: "100%", xl: "70%" }}
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
          w={"100px"}
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
                  Board Color
                </FormLabel>
                <SimpleGrid
                  w={"80%"}
                  m={"10px auto"}
                  columns={4}
                  spacingX={10}
                  spacingY={5}
                >
                  <Box
                    w={"30px"}
                    h={"30px"}
                    bg={"#1d285d"}
                    onClick={() => setColor("#1d285d")}
                    cursor={"pointer"}
                  />
                  <Box
                    w={"30px"}
                    h={"30px"}
                    bg={"#621e1e"}
                    onClick={() => setColor("#621e1e")}
                    cursor={"pointer"}
                  />
                  <Box
                    w={"30px"}
                    h={"30px"}
                    bg={"#e14d15"}
                    onClick={() => setColor("#e14d15")}
                    cursor={"pointer"}
                  />
                  <Box
                    w={"30px"}
                    h={"30px"}
                    bg={"#e76060"}
                    onClick={() => setColor("#e76060")}
                    cursor={"pointer"}
                  />
                  <Box
                    w={"30px"}
                    h={"30px"}
                    bg={"#542572"}
                    onClick={() => setColor("#542572")}
                    cursor={"pointer"}
                  />
                  <Box
                    w={"30px"}
                    h={"30px"}
                    bg={"#386025"}
                    onClick={() => setColor("#386025")}
                    cursor={"pointer"}
                  />
                  <Box
                    w={"30px"}
                    h={"30px"}
                    bg={"#45b0a8"}
                    onClick={() => setColor("#45b0a8")}
                    cursor={"pointer"}
                  />
                  <Box
                    w={"30px"}
                    h={"30px"}
                    bg={"#c4b23c"}
                    onClick={() => setColor("#c4b23c")}
                    cursor={"pointer"}
                  />
                </SimpleGrid>
                <Center
                  w={"60%"}
                  h={"150px"}
                  m={"15px auto"}
                  bg={color}
                  borderRadius={"15px"}
                >
                  <Box
                    w={"85%"}
                    h={"85%"}
                    bg={"rgba(255,255,255,0.24)"}
                    borderRadius={"10px"}
                  />
                </Center>
                <Divider />
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
        <Popover placement={"bottom-end"}>
          <PopoverTrigger>
            <Box>
              <Tooltip label={"account"}>
                <Avatar
                  mr={"10px"}
                  size={"sm"}
                  src={localStorage.getItem("photo")}
                />
              </Tooltip>
            </Box>
          </PopoverTrigger>
          <PopoverContent w={"200px"}>
            <Box my={"10px"} ml={"20px"}>
              <Box my={"5px"} fontSize={"0.8rem"} fontWeight={"bold"}>
                Account
              </Box>
              <Box ml={"10px"}>{localStorage.getItem("nickname")}</Box>
              <Box ml={"10px"}>{localStorage.getItem("email")}</Box>
              <Flex
                cursor={"pointer"}
                mt={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w={"90%"}
                onClick={() => navigate("/u/manage")}
              >
                <Box>Manage account</Box>
                <Box>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Box>
              </Flex>
            </Box>
            <Divider />
            <Box
              my={"10px"}
              ml={"20px"}
              cursor={"pointer"}
              onClick={handleLogout}
            >
              logout
            </Box>
          </PopoverContent>
        </Popover>
      </Flex>
      {location.pathname === "/u/board" && (
        <Board boards={boards} recentBoard={recentBoard} />
      )}
      {location.pathname === "/u/list" && <List boards={boards} />}
      {location.pathname === "/u/manage" && <ManageAccount />}
    </Box>
  );
}

export default WorkSpacePage;
