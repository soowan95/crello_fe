import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Input,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  faChevronLeft,
  faEllipsis,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListTitleComp from "../../component/ListTitleComp";
import { instance } from "../../modules/axios_interceptor";

function List({ boards }) {
  const [boardTitle, setBoardTitle] = useState(
    localStorage.getItem("boardTitle"),
  );
  const [listTitle, setListTitle] = useState(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [isMovingList, setIsMovingList] = useState(false);
  const [lists, setLists] = useState([]);
  const [moveBoard, setMoveBoard] = useState(boardTitle);
  const [moveBoardId, setMoveBoardId] = useState(null);

  const addList = useRef(null);

  const toast = useToast();

  useEffect(() => {
    instance
      .get("/api/v1/list/all?boardId=" + localStorage.getItem("boardId"), {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then(({ data }) => setLists(data));
  }, []);

  const handleTitle = (title) => {
    localStorage.setItem("boardTitle", title);
    instance
      .put("/api/v1/board/update", {
        title: title,
        id: localStorage.getItem("boardId"),
      })
      .then(({ data }) => setLists(data));
  };

  const handleList = () => {
    instance
      .post("/api/v1/list/add", {
        boardId: localStorage.getItem("boardId"),
        title: listTitle,
      })
      .then(({ data }) => {
        setLists(data);
        setListTitle(null);
        addList.current.value = null;
      });
  };

  const handleDeleteList = (id) => {
    instance
      .delete("/api/v1/list/delete?id=" + id)
      .then(() => setLists((lists) => lists.filter((i) => i.id !== id)));
  };

  const handleMoveList = (id) => {
    instance
      .put("/api/v1/list/move", {
        id: id,
        nextId: moveBoardId,
        prevId: localStorage.getItem("boardId"),
      })
      .then(({ data }) => setLists(data));
  };

  return (
    <Box>
      <Box m={"80px auto"} position={"absolute"}>
        <Editable
          w={"fit-content"}
          h={"50px"}
          fontSize={"1.5rem"}
          value={boardTitle}
          _hover={{ bg: "rgba(68,66,66,0.47)" }}
          borderRadius={"10px"}
          onChange={(e) => {
            setBoardTitle(e);
          }}
          onSubmit={(e) => {
            if (e === "") setBoardTitle(localStorage.getItem("boardTitle"));
            else if (boardTitle !== localStorage.getItem("boardTitle"))
              handleTitle(boardTitle);
          }}
          position={"relative"}
          left={"50px"}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Flex
          w={"fit-content"}
          m={"0 auto"}
          gap={3}
          position={"relative"}
          top={"30px"}
          left={"50px"}
        >
          {lists.length !== 0 &&
            lists.map((list) => (
              <Box
                w={"220px"}
                h={"100%"}
                key={list.id}
                bg={"white"}
                color={"black"}
                borderRadius={"10px"}
              >
                <Flex
                  h={"40px"}
                  w={"90%"}
                  m={"5px auto"}
                  justifyContent={"space-between"}
                >
                  <ListTitleComp title={list.title} id={list.id} />
                  <Popover
                    placement={"bottom-start"}
                    onClose={() => setIsMovingList(false)}
                  >
                    <PopoverTrigger>
                      <Button
                        size={"sm"}
                        _hover={{ bg: "#ccc" }}
                        color={"black"}
                      >
                        <FontAwesomeIcon icon={faEllipsis} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      bg={"#e8e8e8"}
                      w={"200px"}
                      boxShadow={"5px 4px 6px rgba(40, 40, 40, 0.7)"}
                    >
                      <PopoverHeader textAlign={"center"}>
                        {!isMovingList && (
                          <Box fontWeight={"bold"}>List actions</Box>
                        )}
                        {isMovingList && (
                          <Flex w={"70%"} justifyContent={"space-between"}>
                            <Box
                              fontSize={"0.8rem"}
                              mt={"-1px"}
                              cursor={"pointer"}
                              onClick={() => setIsMovingList(false)}
                            >
                              <FontAwesomeIcon icon={faChevronLeft} />
                            </Box>
                            <Box fontWeight={"bold"}>Move list</Box>
                          </Flex>
                        )}
                      </PopoverHeader>
                      <PopoverCloseButton />
                      {!isMovingList && (
                        <Box>
                          <Box ml={"10px"} my={"20px"} cursor={"pointer"}>
                            Add card
                          </Box>
                          <Box
                            ml={"10px"}
                            my={"20px"}
                            cursor={"pointer"}
                            onClick={() => setIsMovingList(true)}
                          >
                            Move list
                          </Box>
                          <Box
                            ml={"10px"}
                            my={"20px"}
                            cursor={"pointer"}
                            onClick={() => handleDeleteList(list.id)}
                          >
                            Delete List
                          </Box>
                        </Box>
                      )}
                      {isMovingList && (
                        <Box
                          w={"90%"}
                          m={"10px 5%"}
                          cursor={"pointer"}
                          borderBottom={"1px solid white"}
                          borderRadius={"8px"}
                        >
                          <Box ml={"10px"} mb={"10px"} fontSize={"0.7rem"}>
                            board
                          </Box>
                          <RadioGroup
                            onChange={(e) => {
                              setMoveBoard(
                                boards.filter((b) => b.id - e === 0).at(0)
                                  .title,
                              );
                              setMoveBoardId(e);
                            }}
                          >
                            <Stack spacing={5}>
                              {boards.length !== 0 &&
                                boards.map((board) => (
                                  <Radio key={board.id} value={board.id}>
                                    {board.title === boardTitle
                                      ? board.title + " (current)"
                                      : board.title}
                                  </Radio>
                                ))}
                            </Stack>
                          </RadioGroup>
                          <Button
                            mt={"20px"}
                            size={"sm"}
                            colorScheme={"blue"}
                            isDisabled={moveBoard === boardTitle}
                            onClick={() => handleMoveList(list.id)}
                          >
                            Move
                          </Button>
                        </Box>
                      )}
                    </PopoverContent>
                  </Popover>
                </Flex>
                <Button
                  w={"90%"}
                  m={"5px 5%"}
                  _hover={{ bg: "#ccc" }}
                  color={"black"}
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                  <span style={{ marginLeft: "10px" }}>Add a card</span>
                </Button>
              </Box>
            ))}
          {!isAddingList && (
            <Button
              w={"220px"}
              h={"50px"}
              borderRadius={"10px"}
              onClick={() => setIsAddingList(true)}
            >
              <FontAwesomeIcon icon={faPlus} />{" "}
              <span style={{ marginLeft: "10px" }}>Add another list</span>
            </Button>
          )}
          {isAddingList && (
            <Box
              w={"220px"}
              h={"100%"}
              bg={"white"}
              color={"black"}
              borderRadius={"10px"}
            >
              <Input
                w={"90%"}
                m={"5px 5%"}
                border={"1px solid #ccc"}
                ref={addList}
                defaultValue={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
              />
              <Button m={"5px 5%"} colorScheme={"blue"} onClick={handleList}>
                <span>Add</span>
              </Button>
              <Button
                ml={"-5%"}
                color={"black"}
                size={"sm"}
                onClick={() => setIsAddingList(false)}
              >
                <FontAwesomeIcon icon={faX} />
              </Button>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default List;
