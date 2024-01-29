import {
  Box,
  Button,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  faAlignLeft,
  faChevronLeft,
  faEllipsis,
  faHardDrive,
  faPen,
  faPlus,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListTitleComp from "../../component/ListTitleComp";
import { instance } from "../../modules/axios_interceptor";
import { useNavigate, useParams } from "react-router-dom";
import EditorBox from "../../component/EditorBox";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function List({ boards }) {
  const [boardTitle, setBoardTitle] = useState(
    localStorage.getItem("boardTitle"),
  );
  const [listTitle, setListTitle] = useState(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isAddingCardContent, setIsAddingCardContent] = useState(false);
  const [addingCardIdx, setAddingCardIdx] = useState(-1);
  const [isMovingList, setIsMovingList] = useState(false);
  const [lists, setLists] = useState([]);
  const [moveBoard, setMoveBoard] = useState(boardTitle);
  const [moveBoardId, setMoveBoardId] = useState(null);
  const [checkBoardTitle, setCheckBoardTitle] = useState(null);
  const [cardTitle, setCardTitle] = useState(null);
  const [currentCardTitle, setCurrentCardTitle] = useState(null);
  const [currentCardContent, setCurrentCardContent] = useState(null);
  const [hoverCardIdx, setHoverCardIdx] = useState(-1);
  const [hoverListIdx, setHoverListIdx] = useState(-1);
  const [cardId, setCardId] = useState(null);
  const [cardContent, setCardContent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const addList = useRef(null);
  const checkBoard = useRef(null);

  const { onOpen, isOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const params = useParams();

  useEffect(() => {
    instance
      .get("/api/v1/list/all?boardId=" + localStorage.getItem("boardId"))
      .then(({ data }) => {
        data.push({});
        setLists(data);
      });
  }, []);

  const handleTitle = (title) => {
    localStorage.setItem("boardTitle", title);
    instance.put("/api/v1/board/update", {
      title: title,
      id: localStorage.getItem("boardId"),
    });
  };

  const handleList = () => {
    instance
      .post("/api/v1/list/add", {
        boardId: localStorage.getItem("boardId"),
        title: listTitle,
      })
      .then(({ data }) => {
        data.push({});
        setLists(data);
        setListTitle(null);
        addList.current.value = null;
      });
  };

  const handleDeleteList = (id) => {
    instance
      .delete("/api/v1/list/delete?id=" + id)
      .then(() => window.location.reload());
  };

  const handleMoveList = (id) => {
    instance
      .put("/api/v1/list/move", {
        id: id,
        nextId: moveBoardId,
        prevId: localStorage.getItem("boardId"),
      })
      .then(({ data }) => {
        data.push({});
        setLists(data);
      });
  };

  const handleDeleteBoard = () => {
    instance
      .delete("/api/v1/board/delete?id=" + localStorage.getItem("boardId"))
      .then(() => {
        localStorage.removeItem("boardId");
        localStorage.removeItem("boardTitle");
        localStorage.removeItem("boardColor");
        navigate(`/u/board/${localStorage.getItem("code")}`);
      });
  };

  const handleCardTitle = (listId) => {
    instance
      .post("/api/v1/card/add", {
        listId: listId,
        boardId: localStorage.getItem("boardId"),
        title: cardTitle,
      })
      .then(({ data }) => {
        data.push({});
        setLists(data);
        setIsAddingCard(false);
        setAddingCardIdx(-1);
        setCardTitle(null);
      });
  };

  const handleDeleteCard = () => {
    instance
      .delete(`/api/v1/card/delete/${cardId}`)
      .then(() => window.location.reload());
  };

  const changeCard = () => {
    instance
      .put("/api/v1/card/update", {
        id: cardId,
        boardId: localStorage.getItem("boardId"),
        title: cardTitle,
        content: cardContent,
      })
      .then(({ data }) => {
        data.push({});
        setLists(data);
        setIsAddingCardContent(false);
        setCardContent(null);
      });
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    const cardId = result.draggableId?.split("-")[1];
    const prevIndex = result.source?.index;
    const nextIndex = result.destination?.index;
    const prevListId = result.source?.droppableId.split("-")[1];
    const nextListId = result.destination?.droppableId.split("-")[1];
    if (!nextListId)
      instance
        .delete(`api/v1/card/delete/${cardId}`)
        .then(() => window.location.reload());
    else if (prevListId !== nextListId || nextIndex !== prevIndex)
      instance
        .put("/api/v1/card/move", {
          cardId: cardId,
          nextListId: nextListId,
          nextIndex: nextIndex,
          prevListId: prevListId,
          boardId: localStorage.getItem("boardId"),
        })
        .then(() => window.location.reload());
  };

  return (
    <Box>
      <Box m={"80px auto"} position={"absolute"}>
        <Flex alignItems={"center"}>
          {params.code === localStorage.getItem("code") && (
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
          )}
          {params.code !== localStorage.getItem("code") && (
            <Box
              w={"fit-content"}
              h={"50px"}
              fontSize={"1.5rem"}
              position={"relative"}
              left={"50px"}
              top={"5px"}
            >
              {boardTitle}
            </Box>
          )}
          {params.code === localStorage.getItem("code") && (
            <Popover
              placement={"right-start"}
              onClose={() => {
                setCheckBoardTitle(null);
                checkBoard.current.value = null;
              }}
            >
              <PopoverTrigger>
                <Box ml={"60px"} _hover={{ color: "red" }} cursor={"pointer"}>
                  <FontAwesomeIcon icon={faTrash} />
                </Box>
              </PopoverTrigger>
              <PopoverContent w={"250px"}>
                <FormControl
                  isInvalid={
                    checkBoardTitle !== localStorage.getItem("boardTitle")
                  }
                >
                  <Input
                    w={"90%"}
                    m={"10px 5%"}
                    ref={checkBoard}
                    placeholder={boardTitle}
                    onChange={(e) => setCheckBoardTitle(e.target.value)}
                  />
                  <FormErrorMessage ml={"5%"}>
                    * Input board title to delete board
                  </FormErrorMessage>
                  <Button
                    size={"sm"}
                    ml={"170px"}
                    my={"10px"}
                    isDisabled={
                      checkBoardTitle !== localStorage.getItem("boardTitle")
                    }
                    onClick={handleDeleteBoard}
                  >
                    Delete
                  </Button>
                </FormControl>
              </PopoverContent>
            </Popover>
          )}
        </Flex>
        <Flex
          w={"fit-content"}
          m={"0 auto"}
          gap={3}
          position={"relative"}
          top={"30px"}
          left={"50px"}
        >
          {params.code === localStorage.getItem("code") && (
            <DragDropContext
              onDragEnd={onDragEnd}
              onDragStart={() => setIsDragging(true)}
            >
              {lists.length !== 0 &&
                lists.map((list, idx) => (
                  <Droppable
                    key={idx}
                    droppableId={`list-${list.id}`}
                    index={idx}
                  >
                    {(provided) => (
                      <Center
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        w={"220px"}
                        h={"fit-content"}
                        bg={localStorage.getItem("boardColor")}
                        borderRadius={"15px"}
                        onMouseOver={() => setHoverListIdx(idx)}
                        onMouseLeave={() => setHoverListIdx(-1)}
                      >
                        {idx !== lists.length - 1 && (
                          <Box
                            w={"90%"}
                            bg={"rgba(255,255,255,0.24)"}
                            my={"10px"}
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
                                  <Box
                                    mt={"5px"}
                                    mr={"5px"}
                                    cursor={"pointer"}
                                    onClick={() => {
                                      setIsAddingCard(false);
                                      setAddingCardIdx(-1);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEllipsis} />
                                  </Box>
                                </PopoverTrigger>
                                <PopoverContent
                                  w={"200px"}
                                  boxShadow={
                                    "5px 4px 6px rgba(40, 40, 40, 0.7)"
                                  }
                                >
                                  <PopoverHeader textAlign={"center"}>
                                    {!isMovingList && (
                                      <Box fontWeight={"bold"}>
                                        List actions
                                      </Box>
                                    )}
                                    {isMovingList && (
                                      <Flex
                                        w={"70%"}
                                        justifyContent={"space-between"}
                                      >
                                        <Box
                                          fontSize={"0.8rem"}
                                          mt={"-1px"}
                                          cursor={"pointer"}
                                          onClick={() => setIsMovingList(false)}
                                        >
                                          <FontAwesomeIcon
                                            icon={faChevronLeft}
                                          />
                                        </Box>
                                        <Box fontWeight={"bold"}>Move list</Box>
                                      </Flex>
                                    )}
                                  </PopoverHeader>
                                  <PopoverCloseButton id={"popoverClose"} />
                                  {!isMovingList && (
                                    <Box>
                                      <Box
                                        ml={"10px"}
                                        my={"20px"}
                                        cursor={"pointer"}
                                        onClick={() => {
                                          document
                                            .getElementById("popoverClose")
                                            .click();
                                          setIsAddingCard(true);
                                          setAddingCardIdx(idx);
                                          setCardTitle(null);
                                        }}
                                      >
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
                                        onClick={() =>
                                          handleDeleteList(list.id)
                                        }
                                      >
                                        Delete List
                                      </Box>
                                    </Box>
                                  )}
                                  {isMovingList && (
                                    <Box w={"90%"} m={"10px 5%"}>
                                      <Box
                                        ml={"10px"}
                                        mb={"10px"}
                                        fontSize={"0.7rem"}
                                      >
                                        board
                                      </Box>
                                      <RadioGroup
                                        onChange={(e) => {
                                          setMoveBoard(
                                            boards
                                              .filter((b) => b.id - e === 0)
                                              .at(0).title,
                                          );
                                          setMoveBoardId(e);
                                        }}
                                        value={moveBoardId}
                                      >
                                        <Stack spacing={5}>
                                          {boards.length !== 0 &&
                                            boards.map((board) => (
                                              <Radio
                                                key={board.id}
                                                value={board.id}
                                              >
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
                            {list.cards.length !== 0 &&
                              list.cards.map((card, cidx) => (
                                <Draggable
                                  key={cidx}
                                  draggableId={`card-${card.id}`}
                                  index={cidx}
                                >
                                  {(provided) => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      key={card.id}
                                      w={"90%"}
                                      h={"fit-content"}
                                      lineHeight={"40px"}
                                      m={"10px auto"}
                                      bg={"rgba(0,0,0,0.32)"}
                                      pl={5}
                                      borderRadius={"10px"}
                                      onMouseOver={() => setHoverCardIdx(cidx)}
                                      onMouseLeave={() => setHoverCardIdx(-1)}
                                      position={"relative"}
                                      _hover={{ border: "1px solid #49ca94" }}
                                      onClick={() => {
                                        onOpen();
                                        setCardTitle(card.title);
                                        setCurrentCardTitle(card.title);
                                        setCardId(card.id);
                                        setCardContent(card.content);
                                        setCurrentCardContent(card.content);
                                      }}
                                    >
                                      {card.title}{" "}
                                      {hoverListIdx === idx &&
                                        hoverCardIdx === cidx && (
                                          <span
                                            style={{
                                              fontSize: "0.7rem",
                                              display: "inline-block",
                                              position: "absolute",
                                              top: "-3px",
                                              right: "15px",
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />
                                          </span>
                                        )}
                                      {card.content !== null && (
                                        <div style={{ marginTop: "-10px" }}>
                                          <FontAwesomeIcon icon={faAlignLeft} />
                                        </div>
                                      )}
                                    </Box>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                            <Modal
                              isOpen={isOpen}
                              onClose={() => {
                                onClose();
                                setCardTitle(null);
                                setCurrentCardTitle(null);
                                setCardId(null);
                                setCardContent(null);
                                setCurrentCardContent(null);
                              }}
                              size={"xl"}
                              isCentered={true}
                            >
                              <ModalContent>
                                <ModalHeader>
                                  <Flex>
                                    <Box>
                                      <FontAwesomeIcon icon={faHardDrive} />
                                    </Box>
                                    <Editable
                                      w={"fit-content"}
                                      h={"30px"}
                                      ml={5}
                                      value={cardTitle}
                                      borderRadius={"10px"}
                                      onChange={(e) => {
                                        setCardTitle(e);
                                      }}
                                      onSubmit={(e) => {
                                        if (e === "")
                                          setCardTitle(currentCardTitle);
                                        else if (cardTitle !== currentCardTitle)
                                          changeCard();
                                      }}
                                    >
                                      <EditablePreview />
                                      <EditableInput />
                                    </Editable>
                                    <Box
                                      fontSize={"1rem"}
                                      lineHeight={"40px"}
                                      position={"absolute"}
                                      cursor={"pointer"}
                                      onClick={handleDeleteCard}
                                      right={"20px"}
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </Box>
                                  </Flex>
                                </ModalHeader>
                                <ModalBody>
                                  <Flex>
                                    <Box>
                                      <FontAwesomeIcon icon={faAlignLeft} />
                                    </Box>
                                    <Box ml={"25px"}>
                                      <Box mb={"20px"}>Description</Box>
                                      {!isAddingCardContent &&
                                        cardContent === null && (
                                          <Button
                                            sx={{
                                              width: "500px",
                                              margin: "10px auto",
                                            }}
                                            onClick={() =>
                                              setIsAddingCardContent(true)
                                            }
                                          >
                                            Add a more detailed description...
                                          </Button>
                                        )}
                                      {!isAddingCardContent &&
                                        cardContent !== null && (
                                          <Box
                                            my={"10px"}
                                            w={"500px"}
                                            position={"relative"}
                                          >
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: cardContent,
                                              }}
                                            />
                                            <Button
                                              position={"absolute"}
                                              size={"sm"}
                                              top={0}
                                              right={10}
                                              onClick={() =>
                                                setIsAddingCardContent(true)
                                              }
                                            >
                                              Edit
                                            </Button>
                                          </Box>
                                        )}
                                      {isAddingCardContent && (
                                        <Box m={"10px auto"}>
                                          <EditorBox
                                            setCardContent={setCardContent}
                                            cardContent={cardContent}
                                          />
                                          <Flex my={"10px"}>
                                            <Button
                                              size={"sm"}
                                              colorScheme={"blue"}
                                              onClick={() => {
                                                onClose();
                                                changeCard();
                                              }}
                                            >
                                              Save
                                            </Button>
                                            <Button
                                              ml={1}
                                              size={"sm"}
                                              onClick={() => {
                                                setIsAddingCardContent(false);
                                                setCardContent(
                                                  currentCardContent,
                                                );
                                              }}
                                            >
                                              <FontAwesomeIcon icon={faX} />
                                            </Button>
                                          </Flex>
                                        </Box>
                                      )}
                                    </Box>
                                  </Flex>
                                </ModalBody>
                              </ModalContent>
                            </Modal>
                            {isAddingCard && addingCardIdx === idx && (
                              <Box>
                                <Input
                                  w={"90%"}
                                  m={"0px 5%"}
                                  bg={"rgba(0,0,0,0.32)"}
                                  placeholder={"Input a title"}
                                  onChange={(e) => setCardTitle(e.target.value)}
                                />
                                <Flex my={"10px"}>
                                  <Button
                                    ml={"5%"}
                                    size={"sm"}
                                    colorScheme={"blue"}
                                    onClick={() => handleCardTitle(list.id)}
                                    isDisabled={
                                      cardTitle === null || cardTitle === ""
                                    }
                                  >
                                    Add card
                                  </Button>
                                  <Button
                                    ml={1}
                                    size={"sm"}
                                    onClick={() => {
                                      setIsAddingCard(false);
                                      setAddingCardIdx(-1);
                                      setCardTitle(null);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faX} />
                                  </Button>
                                </Flex>
                              </Box>
                            )}
                            {addingCardIdx !== idx && (
                              <Box
                                w={"90%"}
                                m={"10px auto"}
                                color={"black"}
                                textAlign={"center"}
                                cursor={"pointer"}
                                onClick={() => {
                                  setIsAddingCard(true);
                                  setAddingCardIdx(idx);
                                  setCardTitle(null);
                                }}
                              >
                                <FontAwesomeIcon icon={faPlus} />{" "}
                                <span style={{ marginLeft: "10px" }}>
                                  Add a card
                                </span>
                              </Box>
                            )}
                          </Box>
                        )}
                        {idx === lists.length - 1 && isDragging && (
                          <Box
                            position={"fixed"}
                            bottom={0}
                            left={0}
                            w={"100%"}
                            h={"200px"}
                            textAlign={"center"}
                            lineHeight={"200px"}
                            fontSize={"3rem"}
                            bg={"rgba(255,255,255,0.05)"}
                            _hover={{ color: "red", border: "1px solid" }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Box>
                        )}
                      </Center>
                    )}
                  </Droppable>
                ))}
            </DragDropContext>
          )}
          {params.code !== localStorage.getItem("code") &&
            lists.length !== 0 &&
            lists
              .filter((list) => list.cards)
              .map((list, idx) => (
                <Center
                  w={"220px"}
                  h={"fit-content"}
                  bg={localStorage.getItem("boardColor")}
                  borderRadius={"15px"}
                  key={idx}
                >
                  <Box
                    w={"90%"}
                    bg={"rgba(255,255,255,0.24)"}
                    my={"10px"}
                    borderRadius={"10px"}
                  >
                    <Flex
                      h={"40px"}
                      w={"90%"}
                      m={"5px auto"}
                      justifyContent={"space-between"}
                    >
                      <Box w={"fit-content"} h={"30px"} mt={"5px"}>
                        {list.title}
                      </Box>
                    </Flex>
                    {list.cards.length !== 0 &&
                      list.cards.map((card) => (
                        <Box
                          key={card.id}
                          w={"90%"}
                          h={"fit-content"}
                          lineHeight={"40px"}
                          m={"10px auto"}
                          bg={"rgba(0,0,0,0.32)"}
                          pl={5}
                          borderRadius={"10px"}
                          position={"relative"}
                          cursor={"pointer"}
                          _hover={{ border: "1px solid #49ca94" }}
                          onClick={() => {
                            onOpen();
                            setCardTitle(card.title);
                            setCardId(card.id);
                            setCardContent(card.content);
                          }}
                        >
                          {card.title}{" "}
                          {card.content !== null && (
                            <div style={{ marginTop: "-10px" }}>
                              <FontAwesomeIcon icon={faAlignLeft} />
                            </div>
                          )}
                        </Box>
                      ))}
                    <Modal
                      isOpen={isOpen}
                      onClose={() => {
                        onClose();
                        setCardTitle(null);
                        setCardId(null);
                        setCardContent(null);
                      }}
                      size={"xl"}
                      isCentered={true}
                    >
                      <ModalContent>
                        <ModalHeader>
                          <Flex>
                            <Box>
                              <FontAwesomeIcon icon={faHardDrive} />
                            </Box>
                            <Box w={"fit-content"} h={"30px"} ml={5} mt={"5px"}>
                              {cardTitle}
                            </Box>
                          </Flex>
                        </ModalHeader>
                        <ModalBody>
                          <Flex>
                            <Box>
                              <FontAwesomeIcon icon={faAlignLeft} />
                            </Box>
                            <Box ml={"25px"}>
                              <Box mb={"20px"}>Description</Box>
                              <Box
                                my={"10px"}
                                w={"500px"}
                                position={"relative"}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: cardContent,
                                  }}
                                />
                              </Box>
                            </Box>
                          </Flex>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </Box>
                </Center>
              ))}
          {params.code === localStorage.getItem("code") && !isAddingList && (
            <Button
              w={"220px"}
              h={"50px"}
              borderRadius={"10px"}
              ml={"-230px"}
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
              ml={"-230px"}
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
