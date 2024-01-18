import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faLocationArrow,
  faMagnifyingGlass,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Board from "./Board";
import List from "./List";
import { instance } from "../../modules/axios_interceptor";
import ManageAccount from "./ManageAccount";
import PurchasePage from "../welcome/PurchasePage";

function WorkSpacePage() {
  const [boardTitle, setBoardTitle] = useState(null);
  const [boards, setBoards] = useState([]);
  const [recentBoard, setRecentBoard] = useState(null);
  const [color, setColor] = useState("#1d285d");
  const [searchAll, setSearchAll] = useState(null);
  const [isFocusInput, setIsFocusInput] = useState(false);
  const [isFocusSearchResult, setIsFocusSearchResult] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const searchInput = useRef();

  const { onOpen, isOpen, onClose } = useDisclosure();

  const toast = useToast();

  const navigate = useNavigate();

  const location = useLocation();

  const params = useParams();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) navigate("/login");
    else if (location.pathname.includes("/u/board")) {
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
      .get(`/api/v1/board/all/${params.code}`)
      .then(({ data }) => setBoards(data));
  };

  const handleCreate = () => {
    instance
      .post("/api/v1/board/create", {
        title: boardTitle,
        email: localStorage.getItem("email"),
        color: color,
        isPublic: isPublic,
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

  const handleSearch = (code) => {
    instance
      .get(`/api/v1/user/checkCode/${code}`)
      .then(() => {
        setSearchAll(null);
        searchInput.current.value = null;
        navigate(`/u/board/${code}`);
      })
      .catch((err) => {
        toast({
          description: err.response.data.msg,
          status: "warning",
        });
      });
  };

  const handleSearchAll = (target) => {
    instance
      .get(`/api/v1/user/searchAll/${target}`)
      .then(({ data }) => setSearchAll(data));
  };

  return (
    <Box position={"relative"}>
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
          onClick={() => navigate(`/u/board/${localStorage.getItem("code")}`)}
        >
          <FontAwesomeIcon icon={faChartSimple} /> Crello
        </Box>
        {location.pathname.includes("/u/board") &&
          params.code === localStorage.getItem("code") &&
          ((localStorage.getItem("role") === "TRIAL" && boards.length < 3) ||
            (localStorage.getItem("role") === "COMMON" && boards.length < 5) ||
            localStorage.getItem("role") === "PREMIUM") && (
            <Popover placement={"bottom-start"}>
              <PopoverTrigger>
                <Button mr={"75%"} w={"8%"} size={"sm"}>
                  Create
                </Button>
              </PopoverTrigger>
              <Portal zIndex={2}>
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
                      Whether or not to the public.
                    </FormLabel>
                    <RadioGroup
                      ml={4}
                      mb={"10px"}
                      onChange={setIsPublic}
                      defaultValue={"true"}
                    >
                      <Stack direction="row">
                        <Radio value="true">Public</Radio>
                        <Radio value="false">Private</Radio>
                      </Stack>
                    </RadioGroup>
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
              </Portal>
            </Popover>
          )}
        {location.pathname.includes("/u/board") &&
          params.code === localStorage.getItem("code") &&
          ((localStorage.getItem("role") === "TRIAL" && boards.length === 3) ||
            (localStorage.getItem("role") === "COMMON" &&
              boards.length === 5)) && (
            <Button mr={"75%"} w={"8%"} size={"sm"} onClick={onOpen}>
              Purchase
            </Button>
          )}
        <Modal isOpen={isOpen} onClose={onClose} size={"5xl"} isCentered={true}>
          <ModalOverlay />
          <ModalContent>
            <Box onClick={onClose}>
              <PurchasePage />
            </Box>
          </ModalContent>
        </Modal>
        {location.pathname.includes("/u/board") && (
          <Box w={"70%"} position={"absolute"} top={"2px"} left={"23%"}>
            <Flex
              w={"100%"}
              border={"1px solid rgba(255, 255, 255, 0.3)"}
              borderRadius={"10px"}
              alignItems={"center"}
            >
              <Input
                ref={searchInput}
                border={"none"}
                h={"25px"}
                ml={"10px"}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(" ", "");
                  if (e.target.value && e.target.value !== "") {
                    handleSearchAll(e.target.value);
                  } else setSearchAll(null);
                }}
                onKeyDown={(e) => {
                  if (e.code === "Enter")
                    handleSearch(searchInput.current.value);
                }}
                onFocus={() => setIsFocusInput(true)}
                onBlur={() => setIsFocusInput(false)}
              />
              <Button bg={"none"} size={"sm"}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Flex>
            {(isFocusInput || isFocusSearchResult) && (
              <Box
                bg={"rgba(0,0,0,0.4)"}
                border={"1px solid black"}
                borderRadius={"10px"}
              >
                {searchAll !== null &&
                  searchAll
                    .filter((item) => !item.includes(localStorage.code))
                    .map((search, idx) => (
                      <Flex
                        key={idx}
                        my={"5px"}
                        onClick={() => {
                          handleSearch(search.split("#")[1]);
                          setSearchAll(null);
                        }}
                        onMouseEnter={() => setIsFocusSearchResult(true)}
                        onMouseLeave={() => setIsFocusSearchResult(false)}
                        cursor={"pointer"}
                      >
                        <Box mx={"20px"}>
                          <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Box>
                        <Box w={"300px"}>{search}</Box>
                        <Box ml={"55%"} mr={"20px"}>
                          <FontAwesomeIcon icon={faLocationArrow} />
                        </Box>
                      </Flex>
                    ))}
              </Box>
            )}
          </Box>
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
              <Flex alignItems={"center"}>
                <Box my={"5px"} fontSize={"0.8rem"} fontWeight={"bold"}>
                  Account
                </Box>
                <Badge
                  bg={
                    localStorage.getItem("role") === "TRIAL"
                      ? "#3f2020"
                      : localStorage.getItem("role") === "COMMON"
                        ? "silver"
                        : "#e5c569"
                  }
                  h={"15px"}
                  ml={"5px"}
                  fontSize={"0.7rem"}
                >
                  {localStorage.getItem("role")}
                </Badge>
              </Flex>
              <Box my={"5px"} ml={"10px"} fontSize={"0.8rem"}>
                {localStorage.getItem("email")}
              </Box>
              <Flex my={"5px"} ml={"10px"} alignItems={"center"}>
                <Box>{localStorage.getItem("nickname")}</Box>
                <Badge h={"18px"}>#{localStorage.getItem("code")}</Badge>
              </Flex>
              <Flex
                cursor={"pointer"}
                mt={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w={"90%"}
                onClick={() =>
                  navigate(`/u/manage/${localStorage.getItem("code")}`)
                }
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
      {location.pathname.includes("/u/board") && (
        <Board boards={boards} recentBoard={recentBoard} />
      )}
      {location.pathname.includes("/u/list") && <List boards={boards} />}
      {location.pathname.includes("/u/manage") && <ManageAccount />}
    </Box>
  );
}

export default WorkSpacePage;
